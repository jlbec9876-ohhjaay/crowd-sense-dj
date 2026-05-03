import * as Tone from "tone";
import { AudioAnalyzer } from "./analyzer";

export class Deck {
    constructor(url) {
        this.player = new Tone.Player({
            url,
            loop: true,
            autostart: false,
        });
        // Volume Control (Gain)
        this.gain = new Tone.Gain(1);

        // EQing
        this.eq = new Tone.EQ3({
            low: 0,
            mid: 0,
            high: 0,
        });

        //Signal chain: Player to EQ to Gain to Output
        this.player.connect(this.eq);
        this.eq.connect(this.gain);
        this.gain.toDestination();

        //Analyzer listens to player
        this.analyzer = new AudioAnalyzer();

        this.running = false;
        
        //Animation frame loop ID
        this._rafId = null;

        this.player.onload = () => {
            console.log("Loaded:", url);
        };
    }
    async start() {
        await Tone.start();
        await this.analyzer.init();     //start listening

        this.player.start();
        this.running = true;

        this._startLoop();
    }
    stop() {
        this.player.stop();
        this.running = false;

        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
                this._rafId = null;
        }
    }
    // Volume
    setVolume(v) {
        this.gain.gain.value = v;
    }

    // EQ controls (future scoring goldmine)//
    setEQ({ low = 0, mid = 0, high = 0 }) {
        this.eq.low.value = low;
        this.eq.mid.value = mid;
        this.eq.high.value = high;
    }

    // Real-time analysis loop//
    _startLoop() {
        const loop = () => {
            if (!this.running) return;
            this.analyzer.update();         //HEARTBEAT

            this._rafId = requestAnimationFrame(loop);
        };

        loop();
    }
    // Instant BPM (from analyzer)//
    getBPM() {
        return this.analyzer.getStableBPM();
    }

    //Smoothed BPM (more reliable)//
    getStableBPM() {
        return this.analyzer.getStableBPM();
    }

    //History
    getBpmHistory() {
        return this.analyzer.bpmHistory();
    }
}
