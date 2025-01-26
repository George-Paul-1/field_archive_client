// Looking to implement interactive mouse feature

export class Visualiser {
    
    private cvs: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private W: number;
    private H: number;
    private X: number;
    
    private mouseX: number | null = null; 
    private mouseY: number | null = null;
    
    constructor(canvas: HTMLCanvasElement) {
        this.cvs = canvas;
        this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D;
        
        this.cvs.addEventListener('mousemove', (e) => {
            const rect = this.cvs.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top; 
            });
        
        this.cvs.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
        
        // Set canvas resolution for high-DPI (retina) displays
        const ratio = window.devicePixelRatio || 1;
        const width = window.innerWidth * ratio;
        const height = window.innerHeight * ratio;

        // Update canvas width and height
        this.cvs.width = width;
        this.cvs.height = height;
        
        // Set CSS width and height to match the screen size
        this.cvs.style.width = `${window.innerWidth}px`;
        this.cvs.style.height = `${window.innerHeight}px`;
        
        // Scale the context to match the device pixel ratio
        this.ctx.scale(ratio, ratio);

        this.W = (this.cvs.width = window.innerWidth);
        this.H = (this.cvs.height = window.innerHeight);
        this.X = this.W - 1;
    }

    setCanvas(): void {
        this.ctx.fillStyle = 'hsl(0, 100%, 100%)';
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
            let hue = Math.round(ratio * 120) + 170 % 360;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            let sat = '70%';
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