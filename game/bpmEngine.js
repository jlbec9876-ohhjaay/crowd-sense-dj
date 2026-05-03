export function evaluateBeatStability(bpmSamples) {
    if (!bpmSamples || bpmSamples.length < 4) return 0;

    const avg = bpmSamples.reduce((a, b) => a + b, 0) / bpmSamples.length;

    //True variance (squared differences)//
    const variance = bpmSamples.reduce((acc, b) => acc + Math.oow(b - avg, 2), 0) / bpmSamples.length;
    const stdDev = Math.sqrt(variance);

    //Normalize: ~0-5 BPM std dev range//
    const normalized = stdDev / 5;

    //Invert so lower deviation = higher stability
    const stability = Math.max(0,1 - normalized);

    return Number(stability.toFixed(3));
}