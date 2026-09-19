import "../styles/HistorySidebar.css";
import { getSpacePlans, deleteSpacePlan } from "../api/planner";
import type { SpacePlan } from "../types/planner";
import { useState, useEffect } from "react";
import delIcon from "../assets/delete-svgrepo-com.svg";

interface HistoryProps {
    setPlan: (data: SpacePlan | null) => void;
    spacePlan: SpacePlan | null;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function HistorySideBar({ setPlan, spacePlan, isOpen, setIsOpen }: HistoryProps) {

    const [spacePlans, setSpacePlans] = useState<SpacePlan[]>([]);
    const [planToDelete, setPlanToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = localStorage.getItem("username");

    useEffect(() => {
        async function fetchPlans() {
            setLoading(true);
            
            try {
                const plans = await getSpacePlans();
                setSpacePlans(plans);
            }
            catch (error) {
                setError("Failed to load history");
            }
            finally {
                setLoading(false);
            }
        }

        fetchPlans();
    }, [])

    useEffect(() => {
        if (spacePlan) {
            setSpacePlans((prevPlans) => {
                if (prevPlans.some(p => p.id === spacePlan.id)) return prevPlans;
                return [...prevPlans, spacePlan];
            });
        }
    }, [spacePlan])

    const sortedSpacePlan = [...spacePlans].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })

    const deletePlan = async (id: number) => {
        try {
            // delete the plan on the backend
            await deleteSpacePlan(id);
    
            // set currently displayed plan to null
            setPlan(null);
    
            // set spaceplans
            setSpacePlans((prevPlans) => {
                return prevPlans.filter((plan) => plan.id !== id)
            })
        }
        catch {
            setError("Failed to delete plan");
        }
    }  

    const handleConfirmDelete = async () => {
        if (planToDelete !== null) {
            await deletePlan(planToDelete);
            setPlanToDelete(null); 
        }
    };

    const handleHistoryClick = (plan: SpacePlan) => {
        setPlan(plan);
        setIsOpen(false);
    }

    return (
        <>
        <aside className={`history-side-bar ${isOpen && "open"}`}>
            
            <span className="username"><h2>{username}</h2></span>

            <div className="history-header">
                <h2>History</h2>

                <button
                    className="history-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close history"
                >
                    ×
                </button>
            </div>

            {error && <p className="error-state">{error}</p>}
            {loading && <p className="initial-loading">Getting your history...</p>}

            <div className="history-list">

                {sortedSpacePlan && sortedSpacePlan.length === 0 && !loading && !error &&(
                    <div className="history-empty">
                        <h3>No saved plans yet</h3>
                        <p>
                            Your generated space plans will appear here.
                        </p>
                    </div>
                )}
                {sortedSpacePlan.map((plan) => {
                    const formattedDate = new Date(plan.created_at)
                        .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    
                    return (
                        <button 
                            className={spacePlan?.id === plan.id ? "selected-btn" : "history-btn"} 
                            key={plan.id} 
                            onClick={() => handleHistoryClick(plan)}
                        >
                            <div className="history-title"><strong>{plan.title}</strong></div>
                            <div>{formattedDate}</div>

                            {/* delete button */}
                            <img 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPlanToDelete(plan.id);
                                }} 
                                className="delete-icon" src={delIcon} 
                                alt="Delete Icon" 
                                width="20" 
                                height="20" 
                            />
                        </button>
                    )
                })}
            </div>

        </aside>

        {/* close overlay */}
        {isOpen && <div className="history-overlay" onClick={() => setIsOpen(false)}></div>}
        
        {/* confirmation modal */}
        {planToDelete !== null && (
            <div className="confirmation-background">
                <div className="confirmation-content">
                    <h1>Are you sure?</h1>
                    <p>Do you really want to delete this space plan?</p>
                    <div className="buttons">
                        <button className="btn-primary" onClick={() => setPlanToDelete(null)}>Cancel</button>
                        <button className="btn-danger" onClick={handleConfirmDelete}>Delete</button>
                    </div>
                </div> 
            </div>
        )}
        </>
    )
}

export default HistorySideBar