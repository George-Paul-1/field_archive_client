// Looking to implement interactive mouse feature

export class Visualiser {
    
    private cvs: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private W: number;
    private H: number;
    private X: number; 
    
    constructor(canvas: HTMLCanvasElement) {
        this.cvs = canvas;
        this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D; 
        const ratio = window.devicePixelRatio || 1;
        const width = window.innerWidth * ratio;
        const height = window.innerHeight * ratio;

        this.cvs.width = width;
        this.cvs.height = height;

        this.cvs.style.width = `${window.innerWidth}px`;
        this.cvs.style.height = `${window.innerHeight}px`;

        this.ctx.scale(ratio, ratio);

        this.W = (this.cvs.width = window.innerWidth);
        this.H = (this.cvs.height = window.innerHeight);
        this.X = this.W - 1;
    }

    setCanvas(): void {
        this.ctx.fillStyle = 'hsl(0, 0.00%, 100.00%)';
        this.ctx.fillRect(0, 0, this.W, this.H);
    }

    draw(dataArray: Uint8Array): void {
        const bufferLength = dataArray.length;
        const h = this.H / (bufferLength * 0.75);
        
        let imgData = this.ctx.getImageData(1, 0, this.X, this.H);
        this.ctx.fillRect(0, 0, this.W, this.H);
        this.ctx.putImageData(imgData, 0, 0);
        this.ctx.imageSmoothingQuality = 'high';

        for (let i = 0; i < bufferLength; i++) {
            let ratio = Math.pow(dataArray[i] / 255, 1.5);
            let hue = Math.round(ratio * 120) + 180 % 360;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            let sat = '100%';
            let lit = 10 + (70 * ratio) + '%';
            this.ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}, ${ratio})`;
            this.ctx.moveTo(this.X, this.H - (i * h));
            this.ctx.lineTo(this.X, this.H - (i * h + h));
            this.ctx.lineJoin = 'miter';
            this.ctx.lineCap = 'butt';
            this.ctx.stroke();
        }
    }
}