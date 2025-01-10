export class AudioContextManager {
    private audioCtx: AudioContext;
    private analyser: AnalyserNode;
    private source: AudioBufferSourceNode | null = null;
    private gainNode: GainNode;

    constructor() {
        this.audioCtx = new AudioContext({
            latencyHint: "interactive",
            sampleRate: 44100});
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.minDecibels = -100;

        this.gainNode = this.audioCtx.createGain();
    }

    async createBuffer(response: Response): Promise<AudioBuffer> {
        const audioData = await response.arrayBuffer();
        return this.audioCtx.decodeAudioData(audioData);
    }

    createSource(buffer: AudioBuffer): void {
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = buffer 
        this.connectNodes();
    }

    private connectNodes(): void {
        this.source?.connect(this.gainNode)
        this.gainNode.connect(this.analyser)
        this.analyser.connect(this.audioCtx.destination) 
    }

    getFrequencyData(): Uint8Array {
        const bufferLength = this.analyser.frequencyBinCount
        const data = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(data);
        return data; 
    }

    async play(fadeIn: number, duration: number | null): Promise<void> {
        if (!this.source) {
            throw new Error('Audio source not initialised')
        }
        if (this.audioCtx.state === 'suspended') {
            console.log('context suspended - resuming.')
            await this.audioCtx.resume();
        }
        this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(1, this.audioCtx.currentTime + fadeIn);
        this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime + (duration ?? 0) - fadeIn);
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, (duration ?? 0) - 1);
        
        console.log('starting audio...')
        this.source.start();
    }
}
