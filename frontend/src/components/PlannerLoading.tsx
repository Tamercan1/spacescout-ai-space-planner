import { useState, useEffect } from "react";
import "../styles/PlannerLoading.css";

const loadingMessages = [
    "Understanding your request...",
    "Searching NASA resources...",
    "Warming up the hyperspace engine...",
    "Analyzing discoveries...",
    "Establishing deep space connection...",
    "Crunching mission parameters...",
    "Streaming interstellar data...",
    "Building your space plan...",
]

function PlannerLoading() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((currentIndex) => {
                if (currentIndex >= loadingMessages.length - 1) {
                    return currentIndex;
                }

                return currentIndex + 1;
            });
        }, 5000);

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="planner-loading">
            <div className="loading-orbit">
                <div className="orbit-ring orbit-ring-one"></div>
                <div className="orbit-ring orbit-ring-two"></div>

                <div className="loading-planet"> <span></span> </div>
            </div>

            <div className="loading-content">
                <h2>Planning your discovery</h2>

                <div className="loading-message">
                    <p key={messageIndex}>
                        {loadingMessages[messageIndex]}
                    </p>
                </div>

                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <small> This may take a moment while we explore the universe. </small>
            </div>
        </div>
    )
}

export default PlannerLoading;