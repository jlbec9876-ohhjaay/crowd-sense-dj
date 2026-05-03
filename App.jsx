import { useEffect } from "react";
import Deck from "./components/Deck";
import Crossfader from "./components/Crossfader";
import CrowdMeter from "./components/CrowdMeter";
import SessionTimeline from "./components/SessionTimeline";
import { initMIDI } from "./midi/midi";
import { useStore } from "./store/useStore";

export default function App() {
    const endSession = useStore((s) => s.endSession);
    const updateAnalytics = useStore((s) => s.updateAnalytics);
    const applyTransitionScore = useStore((s) => s.applyTransitionScore);

    const bpmA = useStore((s) => s.bpmA);
    const bpmB = useStore((s) => s.bpmB);
    const stabilityA = useStore((s) => s.stabilityA);
    const stabilityB = useStore((s) => s.stabilityB);

    useEffect(() => {
        try {
            initMIDI();
    } catch (e) {
        console.warn("MIDI not available");
    }
}, []);

    //MAIN ENGINE LOOP
    useEffect(() => {
        const interval = setInterval(() => {
             // 1. Update BPM + stability
             updateAnalytics();

             //2. Simple transition scoring
             if ( bpmA > 0 && bpmB > 0) {
                const bpmDiff = Math.abs(bpmA - bpmB);

                //Normalize BPM difference (0-20 range)
                const bpmScore = Math.max(0, 1 - bpmDiff / 20);

                //Combine with stability
                const stabilityScore = (stabilityA + stabilityB) / 2;

                //Final transition score
                const score = (bpnScore * 0.6) + (stabilityScore * 0.4);

                applyTransitionScore(score);
             }
        }, 500);  //every half second

        return () => clearInterval(interval);
    }, [bpmA, bpmB, stabilityA, stabilityB]);

return (
    <div style={{padding: 20 }}>
        <h1> CrowdSense DJ</h1>

        <div style={{ display: "flex", gap: 20 }}>
            <Deck type="A" />
            <Deck type="B" />
        </div>

        <Crossfader />

        <button onClick={endSession}
        style={{ marginTop: 20}}>
            End Set
        </button>

        <CrowdMeter />
        <SessionTimeline />
      </div>
    );
}
