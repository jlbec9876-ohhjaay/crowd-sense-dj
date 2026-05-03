export class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bpmHistory = [];
        this.lastPeakTime = 0;
        this.energyHistory = [];
    }

    async init() {      //Get system / mic audio
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const source = this.audioContext.createMediaStreamSource(stream);

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        source.connect(this.analyser);
    }

    //Get raw frequency data
    getFrequencyData() {
        if (!this.anaylser) return null;

    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray
    }

    //Estimate energy (used for beat detection)
    getEnergy() {
        const data = this.getFrequencyData();
        if (!data) return 0;

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }

        const energy = sum / data.length;
        this.energyHistory.push(energy);

        if (this.energyHistory.length > 50) {
            this.energyHistory.shift();
        }
        return energy;
    }

    //Detect peaks to approximate BPM
    detectBeat() {
        const now = performance.now();
        const energy = this.getEnergy();

        const avgEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / (this.energyHistory.length || 1 );

        //Peak detection threshold
        if (energy > avgEnergy * 1.3) {
            const interval = now - this.lastPeakTime;

            if (interval > 300 && interval < 2000) {
                const bpm = 60000 / interval;

                this.bpmHistory.push(bpm);

                if (this.bpmHistory.length > 20) {
                    this.bpmHistory.shift();
                    }
                }
                this.lastPeakTime = now;
        }
    }

    //Smoothed BPM
    getStableBPM() {
        if (!this.bpmHistory.length) return 0;

        const avg = this.bpmHistory.reduce((a, b) => a + b, 0) / this.bpmHistory.length;

        return Math.round(avg);
    }

    //Needed for store
    getBpmHistory() {
        return this.bpmHistory;
    }

    //Call this in your loop
    update() {
        this.detectBeat();
        }
    }
