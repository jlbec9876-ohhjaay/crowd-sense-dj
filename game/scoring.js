export function evaluateTransitionEvent({
    crossfadeSpeed,
    crossfaderPosition,
    eqA,
    eqB,
}) {
    let score = 0;
    
    //Crossfader movement
    score += Math.min(1, crossfadeSpeed * 1.5) * 0.4;

    //Bass swap (critical)
    const bassSwap = 1 - Math.abs(eqA.low + eqB.low);
    score += bassSwap * 0.4;

    // Mid/High clarity
    const clarity = 1 - (Math.abs(eqA.mid - eqB.mid) + Math.abs(eqA.high - eqB.high)) / 2;

    score += clarity * 0.2;
    
    return Math.max(0, Math.min(1, score));
}