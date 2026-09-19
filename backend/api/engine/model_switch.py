import httpx
import logging
import json

logger = logging.getLogger(__name__)

class AllModelsFailedError(Exception):
    pass

def call_llm_with_fallback(client, messages, tools, model_list, response_format=None, tool_choice=None):

    last_error = None
    
    for index, model_name in enumerate(model_list):
        try:
            logger.info(f"Attempting API call using model: {model_name}")

            kwargs = {
                "model": model_name,
                "messages": messages,
                "tools": tools,
            }

            if response_format is not None:
                kwargs["response_format"] = response_format
            if tool_choice is not None:
                kwargs["tool_choice"] = tool_choice

            response = client.chat.completions.create(**kwargs)
            
            logger.info(f"Success with model: {model_name}")
            return response

        except Exception as exc:
            last_error = exc
            logger.warning(f"Model '{model_name}' failed. Error: {exc}")
            
            if index < len(model_list) - 1:
                next_model = model_list[index + 1]
                logger.warning(f"Switching to fallback model: {next_model}")
            
    logger.error("All models in the fallback chain have failed.")

    raise AllModelsFailedError(
        f"All {len(model_list)} models failed. Last error: {last_error}"
    ) from last_error
