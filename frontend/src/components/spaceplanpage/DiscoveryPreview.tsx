import type { Discovery } from "../../types/planner";
import { formatToShortDate } from "../../func/parsedate";
import { typeMap } from "../../func/assets";
import "../../styles/DiscoveryPreview.css";

interface DiscoveryProp {
    discovery: Discovery;
    setSelectedDiscoveryCard: (discovery: Discovery) => void;
}

function DiscoveryPreview({discovery, setSelectedDiscoveryCard}: DiscoveryProp) {

    return (
        <div 
            className={`discovery-preview ${discovery.type}`}
            key={discovery.id}
            onClick={() => {
                if (window.getSelection()?.toString()) return
                setSelectedDiscoveryCard(discovery)
            }}
        >   
            <div className="date-type">
                <span className={`strong-${discovery.type}`}>{typeMap[discovery.type]}</span>
                <span className="soft"> 
                    {formatToShortDate(discovery.date)} 
                </span>
            </div>
            <h3>{discovery.title}</h3>
            <p className="soft">{discovery.summary.slice(0, 110) + "..."}</p>
            <button><strong className={`strong-${discovery.type}`}>View details</strong></button>
        </div>
    )
}

export default DiscoveryPreview;