import { testEnv } from "../environments/test";

export class AudioManager {
    private dbConnect: string;
    private audioCtx: AudioContext = new AudioContext;
    private analyser: AnalyserNode = this.audioCtx.createAnalyser();
    private source: AudioBufferSourceNode | null;
    private bufferLength: number = 0;
    private duration: number | null;
    private gainNode: GainNode = this.audioCtx.createGain();
    private urls: string[]; 
    private count: number

    constructor(dbConnect: string) {
        this.dbConnect = dbConnect;
        this.source = null; 
        this.duration = null;
        this.urls = []
        this.count = 0
    }

    async fetchAudioIDs(): Promise<void> {
        try {
            const response: Response = await fetch(testEnv.url3)
            if (!response.ok) {
                throw new Error("couldn't fetch list")
            }
            const data = await response.json()
            let i: number = 0
            while (i < 2) {
                this.urls.push(data[i].AudioLocation)
                i++
            }
            console.log(this.urls)
        } catch (error) {
            console.error(error)
        }
    }

    async fetchAudioURL(): Promise<string> {
        try {
            const response = await fetch(this.dbConnect)
            if (!response.ok) {
                throw new Error("couldn't fetch audio URl")
            }
            const data = await response.json();
            console.log(data)
            if (data.AudioLocation) {
                let audioURL = testEnv.url2 + data.AudioLocation; // Construct full URL for local audio file
                console.log('received audio URL:', audioURL);
                return audioURL
            } else {
                throw new Error('no audio URL in the response');
            }
            
        } catch (error) {
            console.error("error fetching audio url from API:", error)
            return ""
        }
    }

    async loadAudio(url: string): Promise<void> {
        console.log(`loading audio... ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: failed to fetch`);
        }
        console.log(`${response.status} fetch successful`);
        
        this.audioCtx = new AudioContext({
            latencyHint: "interactive",
            sampleRate: 44100});
        this.analyser = this.audioCtx.createAnalyser(); 
        this.analyser.fftSize = 2048;
        this.analyser.minDecibels = -90;
        this.bufferLength = this.analyser.frequencyBinCount;
        const audioData = await response.arrayBuffer();
        const buffer = await this.audioCtx.decodeAudioData(audioData);
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = buffer;
        this.gainNode = this.audioCtx.createGain();
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.duration = buffer.duration;
        console.log(`duration: ${this.duration}`)
        console.log('audio loaded successfully.');
    }

    async play(fadeIn = 3, url: string): Promise<void> {
        if (!this.source) {
            console.log(this.source);
            throw new Error('audio source not initialised');
        }
        if (this.audioCtx.state === "suspended") {
            await this.audioCtx.resume();
        }
        // fade in/out logic
        this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(1, this.audioCtx.currentTime + fadeIn);
        this.gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime + (this.duration ?? 0) - fadeIn);
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, (this.duration ?? 0) - 1);
        this.source.start();
        setTimeout(() => {this.getNext()}, ((this.duration ?? 0)) * 1000)
    }

    async getNext(): Promise<void> {
        try {console.log("get next called")
            if (this.count == this.urls.length-1) {
                this.count = 0;
            } else {
            this.count += 1;
            }
            console.log(`ADDRESS PASSED TO PLAY: ${testEnv.url2 + this.urls[this.count]}`)
            await this.loadAudio(testEnv.url2 + this.urls[this.count])
            await this.play(3, testEnv.url2 + this.urls[this.count]);
        } catch (error) {
            throw new Error("Error in getNext")
        }
    }


    getFrequencyData(): Uint8Array {
        const data = new Uint8Array(this.bufferLength);
        this.analyser.getByteFrequencyData(data);
        return data; 
    }

    async start() {
        await this.fetchAudioIDs()
        let url = await this.fetchAudioURL()
        await this.loadAudio(url)
        await this.play(3, url)
    }
}