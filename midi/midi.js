import { useStore } from "../store/useStore";
import { evaluateTransitionEvent } from "../game/scoring";

//CONFIG (tweak per controller)
const CONFIG = {
    CROSSFADE_CC: 1,            // Change after logging your MIDI
    EQ: {
        A: { low: 10, mid: 11, high: 12 },
        B: { low: 13, mid: 14, high: 15 },
    },
    NOTE_ON: 144,               // 0x90
    CC: 176,                    // 0xB0
    ARM_NOTES: [60, 61],        // deck buttons that "arm" a transition
    SPEED_THRESHOLD: 0.15,      // how fast fader must move to count
    EDGE_GUARD: [0.1, 0.9],     // ignore extreme edges
    DEBUG: false,               // flip true to log MIDI
};

let lastCrossfader = 0.5;
let lastMoveTime = 0;
let transitionArmed = false;

export async function initMIDI() {
    if (!navigator.requestMIDIAccess) {
        console.warn("Web MIDI not supported");
        return;
    }

    try {
        const access = await navigator.requestMIDIAccess();

        for (const input of access.inputs.values()) {
            input.onmidimessage = onMIDImessage;
        }
    } catch (err) {
        console.error("MIDI init failed:", err);
    }
}

function onMIDIMessage(e) {
    const [status, data1, data2] = e.data;
    if (CONFIG.DEBUG) {
        console.log("MIDI:", status, data1, data2);
    }
    handle(status, data1, data2);
}

function handle(status, data1, data2) {
    const store = useStore.getState();

    //CROSSFADER (CC)
    if (status === CONFIG.CC && data1 === CONFIG.CROSSFADE_CC) {
        const value = clamp01(data2 / 127);

        store.setCrossfader(value);
        evaluateMovement(value);
    }

    if (status === CONFIG.CC) {
        const value = data2 / 127;

        if (data1 === CONFIG.EQ.A.low) store.setEQ("A", "low", mapEQ(value));
        if (data1 === CONFIG.EQ.A.mid) store.setEQ("A", "mid", mapEQ(value));
        if (data1 === CONFIG.EQ.A.high) store.setEQ("A", "high", mapEQ(value));

        if (data1 === CONFIG.EQ.B.low) store.setEQ("B", "low", mapEQ(value));
        if (data1 === CONFIG.EQ.B.mid) store.setEQ("B", "mid", mapEQ(value));
        if (data1 === CONFIG.EQ.B.high) store.setEQ("B", "high", mapEQ(value));
    }

    //ARM TRANSITION)
    if (status === CONFIG.NOTE_ON && data2 > 0 && CONFIG.ARM_NOTES.includes(data1)) {
        transitionArmed = true;
    }
}

function evaluateMovement(value) {
    const store = useStore.getState();

    const now = performance.now();
    const delta = Math.abs(value - lastCrossfader);
    const dt = Math.max(1, now - lastMoveTime);      //ms
    const speed = delta / (dt / 1000);              //units per second

    lastCrossfader = value;
    lastMoveTime = now;

    const [minEdge, maxEdge] = CONFIG.EDGE_GUARD;

    //  only score if:
    // - armed by a deck trigger
    // - movement is meaningful
    // - not hugging extreme edges
    if (
        transitionArmed && 
        delta > CONFIG.SPEED_THRESHOLD &&
        value > minEdge &&
        value < maxEdge
    ) {
        const state = useStore.getState();
        const score = evaluateTransitionEvent({
            crossfadeSpeed: speed, 
            crossfaderPosition: value,
            eqA: state.eqA,
            eqB: state.eqB,
        });

        store.applyTransitionScore(score);
        transitionArmed = false;
    }
}

function mapEQ(v) {
    return (v - 0.5) * 2;
}

function clamp01(v) {
    return Math.max(0, Math.min(1, v));
}