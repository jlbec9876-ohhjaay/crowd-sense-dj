export function getCrowdReaction(score, combo) {
    const multiplier = 1 + combo * 0.25;

    //Elite Transition
    if (score > 0.85) {
       const hypeTexts = [
        `🔥 COMBO x${combo}! Crowd exploding!`,
        `🚀 Massive drop! Combo x${combo}!`,
        `💥 Perfect blend! Crowd losing it!`
    ];
        return { 
        text: combo > 2 ? random(hypeTexts): "🔥 Crowd going nuclear!",
        delta: 15 * multiplier,
        };
    }
    // Good transitions
    if (score > 0.65) {
        const goodTexts = [
            `👌 Smooth mix x${combo}`,
            `🎶 Clean transition`,
            `😎 Crowd vibing`
        ];
        return {
            text: combo > 1 ? random(goodTexts): "👍 Nice transition",
            delta: 8 * multiplier,
        };
    }
    //Mid / shaky
    if (score > 0.4) {
        return {
            text: "😬 Crowd unsure...", 
            delta: -5,
        };
    }
    // Bad transition (combo punishment)
    const penalty = -15 -combo * 2;

    const badTexts = [
        "💀 Combo broken!",
        "👎 Crowd losing interest",
        "😡 That was rough...",
    ];
    return {
        text: random(badTexts),
        delta: penalty,
    };
}

//Helper for variation
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
