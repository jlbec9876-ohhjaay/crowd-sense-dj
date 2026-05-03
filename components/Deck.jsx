import { Deck as DeckClass } from "../audio/deck";
import { useStore } from "../store/useStore";
import { tracks } from "../data/tracks";

export default function Deck({ type }) {
    const setDeckA = useStore((s) => s.setDeckA);
    const setDeckB = useStore((s) => s.setDeckB);

    const deck = useStore((s) => type ==="A" ? s.deckA : s.deckB);

    const load = (track) => {
        if (!track) return;

        const d = new DeckClass(track.url);

        if (type === "A") {
            setDeckA(d);
        } else {
            setDeckB(d);
        }
    };
    return (
        <div style={{
            border: "1px solid #444", 
            padding: 10,
            width: 200,
            }}>
            <h3>Deck {type}</h3>

            {/*Track selector */}
            <select 
            defaultValue=""
            onChange={(e) => {
                const index = e.target.value;
                if (index !== "") {
                     load(tracks[index]);
                }
            }}>
                
                <option value="">Select Track</option>
                {tracks.map((t, i) => (
                    <option key={t.id} value={i}>
                        {t.name}
                    </option>
                ))}
            </select>

            {/* Controls*/}
            <div style ={{ marginTop: 10 }}
            >
            <button onClick={() => deck?.start()}>Play</button>
            <button onClick={() => deck?.stop()}
                style={{ marginLeft: 5}}>Stop</button>
        </div>
        </div>
    );
}