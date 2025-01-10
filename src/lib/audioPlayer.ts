import { AudioContextManager } from "./audioContextManager";
import { AudioRepository } from "./audioRepository";
import { testEnv } from "../environments/test";


export class AudioPlayer {
    private contextManager: AudioContextManager | null = null;
    public repo: AudioRepository;
    private currentIndex: number = 0;
    private duration: number | null = null
    private timeoutId: number | null = null;
    
    constructor(dbConnect: string) {
        this.repo = new AudioRepository(dbConnect); 
    }

    async initialise(api: string): Promise<void> {
        await this.repo.fetchAudioURLs(api);
    }

    async playNext(fadeIn: number = 3): Promise<void> {
        const nextURL = this.repo.getURLAtIndex(this.currentIndex);
        if (!nextURL) throw new Error('No more urls to play.');
        await this.loadAndPlay(nextURL, fadeIn);
        this.currentIndex = (this.currentIndex + 1) % this.repo.urls.length

        if (this.duration) {
            this.scheduleNextTrack(fadeIn) 
        }
    }

    private scheduleNextTrack(fadeIn: number): void {
        console.log(`Schedule Called`)
        if (this.timeoutId) clearTimeout(this.timeoutId); 
        this.timeoutId = setTimeout(() => {
            this.playNext(fadeIn).catch((err) => {console.error('Error in playNext: ', err)});
        }, (this.duration ?? 0) * 1000);
    }

    private async loadAndPlay(url: string, fadeIn: number): Promise<void> {
        this.contextManager = new AudioContextManager;
        const response = await fetch(testEnv.url2 + url)
        if (!response.ok) throw new Error(`Error ${response.status} could not fetch`);

        const buffer = await this.contextManager.createBuffer(response);
        this.duration = buffer.duration;

        this.contextManager.createSource(buffer);
        await this.contextManager.play(fadeIn, this.duration); 
    }

    stop(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    getFrequencyData(): Uint8Array {
        if (this.contextManager) return this.contextManager.getFrequencyData(); 
        return new Uint8Array()
    }


}