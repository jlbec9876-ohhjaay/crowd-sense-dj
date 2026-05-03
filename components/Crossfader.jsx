import {useStore } from "../store/useStore";

export default function Crossfader() {
    const crossfader = useStore((s) => s.crossfader);
    const setCrossfader = useStore((s) => s.setCrossfader);

    const handleChange = (e) => {
        const value = Number(e.target.value);
        setCrossfader(value);
    };

    return (
        <div style={{ marginTop: 20 }}>
            <h3>Crossfader</h3>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
>
    <span style={{ fontSize: 12 }}>Deck A</span>

            <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crossfader}
            onChange={handleChange} style={{
                flex:1,
                cursor: "pointer",
                accentColor: "#ff4d4d",
            }}
            />

            <span style={{ fontSize: 12 }}>Deck B</span>
            </div>

            <div style={{
                marginTop: 8,
                fontSize: 12,
                display: "flex",
                justifyContent: "space-between",
            }}
            >
                <span>A</span>

                <span>{crossfader.toFixed(2)}</span>
                <span>B</span>
            </div>
        </div>
    );
}