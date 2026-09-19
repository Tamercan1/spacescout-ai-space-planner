import type { Discovery, SpacePlan } from "../../types/planner"
import DiscoveryPreview from "./DiscoveryPreview";
import DiscoveryModal from "./DiscoveryModal";
import PromptPreview from "./PromptPreview";
import { formatToShortDate } from "../../func/parsedate";
import "../../styles/RenderSpacePlan.css";
import { useState } from "react";

interface SpacePlanProp {
    spacePlan: SpacePlan;
    selectedDiscoveryCard: Discovery | null;
    setSelectedDiscoveryCard: (discovery: Discovery | null) => void;
}

function RenderSpacePlan({spacePlan, selectedDiscoveryCard, setSelectedDiscoveryCard}: SpacePlanProp) {

    const [categoryType, setCategoryType] = useState("");
    
    const filteredDiscoveries = spacePlan.discoveries.filter((discovery) => {
        if (categoryType === "") return true;
        return discovery.type === categoryType;
    })

    return (
        <section className="spaceplan-container">
            <div className="title-summary">
                <PromptPreview spacePlan={spacePlan} />
                <br /><br />
                <span>{`SPACE PLAN - ${formatToShortDate(spacePlan.created_at)}`}</span>
                <h2>{spacePlan.title}</h2>    
                <p>{spacePlan.summary}</p>
            </div>

            {spacePlan.discoveries.length !== 0 && (
                <div className="discoveries-container">
                    <div className="discovery-menu">
                        <button className={categoryType === "" ? "active" : ""} onClick={() => setCategoryType("")}>All</button>
                        <button className={categoryType === "apod" ? "active" : ""} onClick={() => setCategoryType("apod")}>Astronomy picture</button>
                        <button className={categoryType === "neo" ? "active" : ""} onClick={() => setCategoryType("neo")}>Near-earth object</button>
                        <button className={categoryType === "solar_flare" ? "active" : ""} onClick={() => setCategoryType("solar_flare")}>Solar flare</button>
                        <button className={categoryType === "general" ? "active" : ""} onClick={() => setCategoryType("general")}>General</button>
                    </div>

                    {filteredDiscoveries.length === 0 && (
                        <div className="discovery-empty">
                            <h3 className="soft">No discoveries for this category</h3>
                        </div>
                    )}
                    
                    <div className="discoveries">
                        
                        {filteredDiscoveries.map((discovery) => (
                            <DiscoveryPreview 
                                key={discovery.id}
                                discovery={discovery} 
                                setSelectedDiscoveryCard={setSelectedDiscoveryCard}
                            />
                        ))}
                    </div>  

                    {selectedDiscoveryCard && (
                        <div
                            className="modal-background"
                            onClick={() => setSelectedDiscoveryCard(null)}
                        >
                            {/* inner card box */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DiscoveryModal discovery={selectedDiscoveryCard} setSelectedCard={setSelectedDiscoveryCard}/>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default RenderSpacePlan;