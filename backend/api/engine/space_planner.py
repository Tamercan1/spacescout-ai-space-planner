import os
import json
from datetime import date
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import ValidationError
from api.engine.tool_registry import tool_registry, tools
from api.engine.system_prompt import SYSTEM_PROMPT
from api.engine.schema import SpacePlan
from api.engine.model_switch import call_llm_with_fallback, AllModelsFailedError

load_dotenv()

PROVIDER = os.getenv("LLM_PROVIDER", "openrouter")

PROVIDER_CONFIG = {
    "gemini": {
        "api_key": os.getenv("GEMINI_API_KEY"),
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "models": [
            "gemini-3.8-flash",
            "gemma-4-26b-a4b-it",
            "gemini-3-flash",
            "gemini-2.5-flash" 
        ]
    },
    "openrouter": {
        "api_key": os.getenv("OPENROUTER_API_KEY"),
        "base_url": "https://openrouter.ai/api/v1",
        "models": [
            "dots-studio/dots-3-note-preview:free",
            "openrouter/free",
        ]
    }
}

config = PROVIDER_CONFIG[PROVIDER] # Provider is either gemini or openrouter

client = OpenAI(
    api_key=config["api_key"],
    base_url=config["base_url"]
)


MODELS_LIST = config["models"]

MAX_TOOL_ROUNDS = 5
MAX_DISCOVERIES = 10

RESPONSE_FORMAT = {
    "type": "json_schema",
    "json_schema": {
        "name": "space_plan",
        "schema": SpacePlan.model_json_schema(),
        "strict": True
    }
}

# For every invalid outputs, we raise this error class
class SpacePlannerError(Exception):
    pass


def handle_tool_call(tool_call):

    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)

    handler = tool_registry[function_name]["handler"]

    try:
        return handler(**arguments)
    except TypeError:
        return {"error": f"Invalid arguments for '{function_name}'"}
    except Exception:
        return {"error": f"'{function_name}' failed unexpectedly"}


def parse_and_validate(content):
    data = json.loads(content or "")
    plan = SpacePlan.model_validate(data)

    if len(plan.discoveries) > MAX_DISCOVERIES:
        plan.discoveries = plan.discoveries[:MAX_DISCOVERIES]
 
    return plan


def llm_call(messages, response_format=None, tool_choice=None):

    kwargs = {
        "client": client, 
        "messages": messages, 
        "tools": tools, 
        "model_list": MODELS_LIST,
    }

    if response_format is not None:
        kwargs["response_format"] = response_format
    if tool_choice is not None:
        kwargs["tool_choice"] = tool_choice
    
    try:
        return call_llm_with_fallback(**kwargs)
    except AllModelsFailedError as exc:
        raise SpacePlannerError("All AI models are currently unavailable.") from exc


def run_space_planner(user_request) -> SpacePlan:

    messages = [
        {
            "role": "system",
            "content": f"{SYSTEM_PROMPT}\n\nCurrent date: {date.today().isoformat()}"
        },
        {
            "role": "user",
            "content": user_request
        }
    ]

    response = llm_call(messages)
    assistant_message = response.choices[0].message

    rounds = 0
    while assistant_message.tool_calls and rounds < MAX_TOOL_ROUNDS:
        rounds += 1
 
        messages.append(assistant_message.model_dump(exclude_none=True))

        for tool_call in assistant_message.tool_calls:

            result = handle_tool_call(tool_call)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            })

        response = llm_call(messages)
        
        assistant_message = response.choices[0].message

    # FINAL MESSAGE 
    messages.append({
        "role": "system",
        "content": (
            "Investigation complete. Respond now with the final SpacePlan "
            "JSON only — no further tool calls."
        ),
    })

    final_response = llm_call(messages, response_format=RESPONSE_FORMAT, tool_choice="none")

    final_data = final_response.choices[0].message.content

    try:
        validated_data = parse_and_validate(final_data)
        return validated_data # This is a pydantic object of SpacePlan

    # If invalid json format, RETRY
    except (json.JSONDecodeError, ValidationError) as exc:
        messages.append({"role": "assistant", "content": final_data})
        messages.append({
            "role": "user",
            "content": (
                f"That response was not valid JSON matching the required schema. "
                f"Error: {exc}. Return ONLY the corrected JSON object, nothing else."
            ),
        })

        retry_response = llm_call(messages, response_format=RESPONSE_FORMAT, tool_choice="none")

        try:
            retried_data = retry_response.choices[0].message.content
            return parse_and_validate(retried_data)
        except (json.JSONDecodeError, ValidationError) as exc2:
            raise SpacePlannerError(
                f"Model could not produce a valid SpacePlan after retry: {exc2}"
            ) from exc2


# PROTOTYPES
def main():
    prompt = "Plan me me something. Whats interesting thing in space this week?"
    try:
        result = run_space_planner(prompt)
        print(result.model_dump_json(indent=4))
    # display the error
    except SpacePlannerError as exc:
        print(f"SpacePlanner failed: {exc}")


if __name__ == "__main__":
    main()