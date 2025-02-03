import { AudioContextManager } from "./audioContextManager";
import { AudioRepository } from "./audioRepository";


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
        await this.repo.fetchSize(api);
    }

    async playNext(fadeIn: number = 3): Promise<void> {
        const nextID: number = this.repo.getIDAtIndex(this.currentIndex);
        await this.loadAndPlay(nextID, fadeIn);
        this.currentIndex = (this.currentIndex + 1) % this.repo.length 
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

    private async loadAndPlay(id: number, fadeIn: number): Promise<void> {
        this.contextManager = new AudioContextManager;
        const response = await fetch(`/api/recordings/recording?id=${id}`)
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