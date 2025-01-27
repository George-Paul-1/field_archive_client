<head>
    <link href='./homestyle.css' rel='stylesheet'>
</head>
<script lang="ts">
    import { Visualiser, AudioPlayer } from "$lib";
    import { testEnv } from "../environments/test";

    let canvas: HTMLCanvasElement;
    let player: AudioPlayer;
    let visualiser: Visualiser;
    let isStarted: boolean;
    let isFading: boolean; 

    const start = async() => {
        if (isStarted) return; 
        
        isFading = true;
        setTimeout(() => isStarted = true, 3000);

        const dbConnectURL: string = testEnv.url
        const apiURL: string = testEnv.url3

        player = new AudioPlayer(dbConnectURL);
        await player.initialise(apiURL);
        
        
        visualiser = new Visualiser(canvas);
        visualiser.setCanvas();


        function renderFrame(): void {
            const freqData: Uint8Array = player.getFrequencyData();
            visualiser.draw(freqData);
            requestAnimationFrame(renderFrame);  
        }
        await player.playNext();
        renderFrame();
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
                <a href="/about">About</a>
            </li>
        </ul>
    </nav>
{/if}   
<canvas bind:this={canvas}></canvas>






