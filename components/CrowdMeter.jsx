import { useStore } from "../store/useStore";

export default function CrowdMeter() {
    const {
        crowdEnergy,
        lastReaction,
        combo,
        bpmA,
        bpmB,
        stabilityA,
        stabilityB,
        report,
    } = useStore();

    return (
        <div style={{ marginTop: 20 }}>
            <h3> Crowd + Performance Dashboard</h3>

            {/* Crowd Meter */}
            <div style={{ width: 300, background: "#222", height: 20 }}>
                <div
                    style={{
                        width: `${crowdEnergy}%`,
                        height: "100%",
                        background:
                            crowdEnergy > 70
                                ? "lime"
                                : crowdEnergy > 40
                                ? "orange"
                                : "red",
                    }}
                />
            </div>

            <p>Energy: {crowdEnergy}</p>
            <p>Combo: x{combo}</p>
            <p>{lastReaction}</p>

            <hr />

            {/* analytics */}
            <h4>Deck Analytics</h4>
            <p>Deck A BPM: {bpmA}</p>
            <p>Deck B BPM: {bpmB}</p>

            <p>Deck A Stability: {(stabilityA * 100).toFixed(0)}%</p>
            <p>Deck B Stability: {(stabilityB * 100).toFixed(0)}%</p>

            {report && (
              <> 
                <hr />
                <h3> DJ Report Card</h3>
                <p>Grade: {report.grade}</p>
                <p>Score: {report.score}</p>
                <p>{report.summary}</p>
              </>
             )}
        </div>
    );
}