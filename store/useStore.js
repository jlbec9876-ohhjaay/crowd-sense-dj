import { create } from "zustand";
import { getCrowdReaction } from "../game/crowdEngine";
import { evaluateBeatStability } from "../game/bpmEngine";
import { generateReportCard } from "../game/reportCard";

export const useStore = create((set, get) => ({
    deckA: null,
    deckB: null,

    crossfader: 0.5,

    crowdEnergy: 25,

    combo: 0,
    maxCombo: 0,

    lastReaction: "",

    bpmA: 0,
    bpmB: 0,

    stabilityA: 0,
    stabilityB: 0,

    //SESSION TRACKING//
    transitionScores: [],
    crowdHistory: [],
    timeline: [],

    startTime: Date.now(),

    report: null,

    setCrossfader: (v) => {
        const {deckA, deckB } = get();

        // Equal-power curve
        const leftGain = Math.cos((v * Math.PI) / 2);
        const rightGain = Math.sin((v * Math.PI) / 2);
        
        if (deckA) deckA.setVolume(leftGain);
        if (deckB) deckB.setVolume(rightGain);

        set({ crossfader: v });
      },

    setDeckA: (d) => set({ deckA: d }),
    setDeckB: (d) => set({ deckB: d }),

    updateAnalytics: () => {
        const { deckA, deckB } = get();
        
        if (!deckA || !deckB) return;

        const bpmA = deckA.getStableBPM();
        const bpmB = deckB.getStableBPM();

        const stabilityA = evaluateBeatStability(deckA.getBpmHistory());
        const stabilityB = evaluateBeatStability(deckB.getBpmHistory());

        set({
            bpmA,
            bpmB,
            stabilityA,
            stabilityB,
        });
    },

    applyTransitionScore: (score) => {
        const state = get();
        const isGood = score > 0.65;
        const combo = isGood ? state.combo + 1 : 0;
        const maxCombo = Math.max(state.maxCombo, combo);
        const reaction = getCrowdReaction(score, combo);
        const elapsed = Date.now() - state.startTime;
        const updatedEnergy = Math.max(0, Math.min(100, state.crowdEnergy + reaction.delta));

        set((s) => ({
            combo,
            maxCombo,
            crowdEnergy: updatedEnergy,
            lastReaction: reaction.text,
            transitionScores: [...s.transitionScores, score],
            crowdHistory: [...s.crowdHistory, updatedEnergy],
            timeline: [...s.timeline, {
                    time: elapsed,
                    energy: updatedEnergy,
                    combo,
                },
            ],
        }));
    },

    endSession: () => {
        const state = get();

        const avgScore = state.transitionScores.reduce((a, b) => a + b, 0) / (state.transitionScores.length || 1);

        const avgCrowdEnergy = state.crowdHistory.reduce((a, b) => a + b, 0) / (state.crowdHistory.length || 1);
        
        const bpmConsistency = (state.stabilityA + state.stabilityB) / 2;

        const report = generateReportCard({
            avgScore,
            maxCombo: state.maxCombo,
            avgCrowdEnergy,
            bpmConsistency,
        });

        set({ report });
    },
}));