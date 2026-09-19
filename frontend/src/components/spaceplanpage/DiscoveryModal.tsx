import type { Discovery } from "../../types/planner";
import { FileText, ScrollText, Rocket, List } from "lucide-react";
import "../../styles/DiscoveryModal.css";

interface DiscoveryModalProp {
    discovery: Discovery;
    setSelectedCard: (card: Discovery | null) => void;
}

function DiscoveryModal({discovery, setSelectedCard}: DiscoveryModalProp) {
    let formattedDate = null;

    if (discovery.date) {
        formattedDate = new Date(discovery.date)
            .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    }

    return (
        <div className="discovery-modal">

            <div className="title-date">
                <h2>{discovery.title}</h2>
                {formattedDate && <p>{formattedDate}</p>} 
            </div>

            <div className="detail-fields">

                {discovery.media_url && (
                    discovery.media_type === "image"
                    ? <img src={discovery.media_url} alt={discovery.title} />
                    : <video controls>
                        <source src={discovery.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                <div className="discovery-header">
                    <ScrollText size={20}/>
                    <h3>Summary</h3>
                </div>
                <p>{discovery.summary}</p>

                <div className="discovery-header">
                    <Rocket size={20}/>
                    <h3>Why Interesting</h3>
                </div>
                <p>{discovery.why_interesting}</p>

                <div className="discovery-header">
                    <List size={20} />
                    <h3>Key Facts</h3>
                </div>
                
                <ul>
                    {Object.entries(discovery.facts).map(
                    ([key, value]) => <li 
                        key={`${discovery.id}-${key}`}
                    >
                        <strong>{key}</strong>: {String(value)}
                    </li>
                )}
                </ul>
                
                <div className="view-source">
                    <FileText size={20}/>
                    <a href={discovery.source} target="_blank" rel="noopener noreferrer">
                        <h3>View source</h3>
                    </a>
                </div>
            </div>
            <button 
                className="btn-primary sticky-btn" 
                onClick={() => setSelectedCard(null)}
            >
                Close
            </button>
        </div>
    )
}

export default DiscoveryModal