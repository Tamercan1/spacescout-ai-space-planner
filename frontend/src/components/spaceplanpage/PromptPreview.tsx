import type { SpacePlan } from "../../types/planner"
import "../../styles/PromptPreview.css";

function PromptPreview({ spacePlan }: {spacePlan: SpacePlan}) {

    return (
        <details>
            <summary className="view-prompt">View Prompt</summary>

            <p>{spacePlan.prompt}</p>
        </details>
    )
}

export default PromptPreview