<link href='./homestyle.css' rel='stylesheet'>
<script lang="ts">
    import { Visualiser } from "$lib";
    import { audioPlayer } from '../stores/audio';
    import { testEnv } from "../environments/test";

    let canvas: HTMLCanvasElement;
    let visualiser: Visualiser;
    let isStarted: boolean;
    let isFading: boolean; 

    const start = async() => {
        if (isStarted) return; 
        audioPlayer.subscribe(async player => {      isFading = true;
        if (player) {    
            setTimeout(() => isStarted = true, 3000);
            const dbConnectURL: string = testEnv.url
            const apiURL: string = testEnv.url3
            visualiser = new Visualiser(canvas);
            visualiser.setCanvas();

            function renderFrame(): void {
                if (player) {
                const freqData: Uint8Array = player.getFrequencyData();
                visualiser.draw(freqData);
                requestAnimationFrame(renderFrame);  
            }};
            await player.playNext();
            renderFrame();
        }});
    }
</script>

{#if !isStarted} 
    <button 
        onclick={start}
        class:fade-out={isFading}
        >Field Archive
    </button>
{/if}
{#if isFading} 
    <nav class:fade-in={isFading}>
        <ul>
            <li>
                <a href="/map">Map</a>
            </li>
        </ul>
    </nav>
{/if}   
<canvas bind:this={canvas}></canvas>







