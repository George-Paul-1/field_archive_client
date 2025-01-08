import { testEnv } from "../environments/test";

export class AudioManager {
    private dbConnect: string;
    private audioCtx: AudioContext;
    private analyser: AnalyserNode;
    private source: AudioBufferSourceNode | null;
    private bufferLength: number;
    private duration: number | null;
    private gainNode: GainNode;
    private audioURL: string;
    
    constructor(dbConnect: string) {
        this.dbConnect = dbConnect;
        this.audioCtx = new AudioContext({
                                    latencyHint: "interactive",
                                    sampleRate: 44100});
        this.analyser = this.audioCtx.createAnalyser(); 
        this.analyser.fftSize = 2048;
        this.analyser.minDecibels = -90;
        
        this.source = null;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.duration = null;
        this.gainNode = this.audioCtx.createGain();
        this.audioURL = ""
    }


    async fetchAudioURL(): Promise<void> {
        try {
            const response = await fetch(this.dbConnect)
            if (!response.ok) {
                throw new Error("Couldn't fetch audio URl")
            }
            const data = await response.json();
            console.log(data)
            if (data.AudioLocation) {
                this.audioURL = testEnv.url2 + data.AudioLocation; // Construct full URL for local audio file
                console.log('Received audio URL:', this.audioURL);
            } else {
                throw new Error('No audio URL in the response');
            }
        } catch (error) {
            console.error("Error fetching audio url from API:", error)
        }
    }

    async loadAudio(url: string): Promise<void> {
        console.log('loading audio...');
        console.log()
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: failed to fetch`);
        }
        console.log(`${response.status} fetch successful`);
    
        const audioData = await response.arrayBuffer();
        const buffer = await this.audioCtx.decodeAudioData(audioData);
        
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.duration = buffer.duration;
        console.log('Audio loaded successfully.');
    }

    async play(fadeIn = 3): Promise<void> {

        if (!this.audioURL) {
            throw new Error("Audio URL not set")
        }

        await this.loadAudio(this.audioURL)

        if (!this.source) {
            console.log(this.source);
            throw new Error('audio source not initialised');
        }
        // fade in/out logic
        this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(1, this.audioCtx.currentTime + fadeIn);
        this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime + (this.duration ?? 0) - fadeIn);
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (this.duration ?? 0));
        this.source.start();
    }

    getFrequencyData(): Uint8Array {
        const data = new Uint8Array(this.bufferLength);
        this.analyser.getByteFrequencyData(data);
        return data; 
    }

}