export class AudioRepository {
    public idStore: Set<number>;
    public length: number

    constructor() {
        this.idStore = new Set<number>();
        this.length = 0; 
    }

    async fetchSize(): Promise<void> {
        try {
        const response: Response = await fetch('/api/recordings/count');
        if (! response.ok) {
            throw new Error("Trouble fetching count");
        }
        const data = await response.json(); 
        this.length = data.count; 
        while (this.idStore.size < data.count) {
            let n: number = Math.floor(Math.random() * (data.count - 1 + 1) + 1); 
            this.idStore.add(n)
        }
        } catch (error) {
            console.log(error)
        }
    }

    getIDAtIndex(index: number): number {
        return [...this.idStore][index] 
    }

}