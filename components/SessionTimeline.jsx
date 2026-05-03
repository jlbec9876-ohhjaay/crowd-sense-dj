import {
    LineChart,
    Line, 
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { useStore } from "../store/useStore";

export default function SessionTimeline() {
    const timeline = useStore ((s) => s.timeline);

    if (!timeline.length) {
        return <p>No session data yet...</p>;
    }

    //Convert ms to seconds
    const formattedData = timeline.map((point) => ({ ...point, time: (point.time / 1000).toFixed(1),
    }));

    return (
        <div style={{ marginTop: 30 }}>
            <h3> Session Timeline</h3>

                <ResponsiveContainer width="100%" height={300}>
                <LineChart data = {formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />

                {/* Crowd Energy*/}
                <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#00ff99"
                    strokeWidth={3}
                    dot={false}
                />

                {/*Combo Overlay*/}
                <Line
                    type="montone"
                    dataKey="combo"
                    stroke="#ffaa00"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
}