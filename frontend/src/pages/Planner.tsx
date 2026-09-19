import HistorySideBar from "../components/HistorySidebar";
import PlannerLoading from "../components/PlannerLoading";
import React from "react";
import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { createSpacePlan } from "../api/planner";
import type { SpacePlan, Discovery } from "../types/planner";
import type { LayoutContext } from "../components/ProtectedRoutes";
import "../styles/Planner.css"
import RenderSpacePlan from "../components/spaceplanpage/RenderSpacePlan";


function Planner() {
    const [prompt, setPrompt] = useState("");
    const [spacePlan, setSpacePlan] = useState<SpacePlan | null>(null);
    const [selectedDiscoveryCard, setSelectedDiscoveryCard] = useState<Discovery | null>(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { isHistoryOpen, setIsHistoryOpen } = useOutletContext<LayoutContext>()

    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!prompt.trim()) { return }

        setSpacePlan(null);
        setLoading(true);
        setError("");

        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        try {
            const plan = await createSpacePlan(prompt);
            setSpacePlan(plan);
        }
        catch (error) {
            console.error(error);
            setError("Something went wrong while creating your space plan.");
        }
        finally {
            setLoading(false);
            setPrompt("")
        }
    }

    return (
        <div className="main-div">
            {/* sidebar */}
            <HistorySideBar 
                setPlan={(data) => setSpacePlan(data)} 
                spacePlan={spacePlan}
                isOpen={isHistoryOpen}
                setIsOpen={setIsHistoryOpen}
            />

            {/* spaceplan page */}
            <main className="main-page">
                <div className="prompt-container">
                    <form onSubmit={handleSubmit} className="form-container">
                        <h2>What would you like to discover?</h2>
                        <br />
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask something about space.."
                            rows={5}
                        ></textarea>
                        <br />
                        <button disabled={loading} className="btn-primary">
                            {loading ? "Planning..." : "Generate Plan"}
                        </button>
                    </form>
                    {/* <button onClick={() => console.log(spacePlan)}>Console Result</button> */}
                    {error && <p>{error}</p>}
                </div>

                {loading && <PlannerLoading />}
                
                {!spacePlan && !loading && (
                    <div className="planner-empty">
                        <h2>Ready to explore?</h2>
                        <p>Describe something you'd like to discover about the space.</p>
                    </div>
                )}

                {spacePlan && (
                    <RenderSpacePlan 
                        key={spacePlan.id}
                        spacePlan={spacePlan} 
                        selectedDiscoveryCard={selectedDiscoveryCard}
                        setSelectedDiscoveryCard={setSelectedDiscoveryCard}
                    />
                )}
                <div ref={bottomRef}></div>
            </main>
        </div>
    )

}

export default Planner