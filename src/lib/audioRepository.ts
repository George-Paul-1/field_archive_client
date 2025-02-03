export class AudioRepository {
    private dbConnect: string;
    public idStore: Set<number>;
    public length: number

    constructor(dbConnect: string) {
        this.dbConnect = dbConnect
        this.idStore = new Set<number>();
        this.length = 0; 
    }

    async fetchSize(api: string): Promise<void> {
        try {
        const response = await fetch('/api/recordings/count');
        if (! response.ok) {
            throw new Error("Trouble fetching count");
        }
        const data = await response.json(); 
        this.length = data.count; 
        while (this.idStore.size < data.count) {
            let n= Math.floor(Math.random() * (data.count - 1 + 1) + 1); 
            this.idStore.add(n)
        }
        } catch (error) {
            console.log(error)
        }
        // try {
        //     const response: Response = await fetch(api)
        //     if (!response.ok) {
        //         throw new Error("couldn't fetch list")
        //     }
        //     const data = await response.json()
        //     this.urls = data.map((item: any) => item.AudioLocation)
        //     this.shuffle()
        // } catch (error) {
        //     console.error(error)
        // }
    }

    // shuffle() {
    //     for (var i = this.urls.length - 1; i >= 0; i--) {
    //         var j = Math.floor(Math.random() * (i + 1));
    //         var temp = this.urls[i];
    //         this.urls[i] = this.urls[j];
    //         this.urls[j] = temp;
    //         }
    // }

    // getNextURL(currentIndex: number): string | null {
    //     console.log(`URLS LENGTH: ${this.urls.length}`)
    //     if (this.urls.length === 0) return null 
    //     const nextIndex = (currentIndex + 1) % this.urls.length;
    //     console.log(`NEXT INDEX ${nextIndex}`)
    //     return this.urls[nextIndex]
    // }

    getIDAtIndex(index: number): number {
        return [...this.idStore][index] 
    }

}