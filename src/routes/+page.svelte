<head>
    <link href='./homestyle.css' rel='stylesheet'>
</head>
<script lang="ts">
    import { Visualiser, AudioPlayer } from "$lib";
    import { isAudioStarted } from "$lib/stores";
    import { testEnv } from "../environments/test";

    let canvas: HTMLCanvasElement;
    let player: AudioPlayer;
    let visualiser: Visualiser;
    let isStarted: boolean;

    $: isAudioStarted.subscribe(value => isStarted = value);

    const startAudio = async() => {
        if (isStarted) return; 
        
        const dbConnectURL: string = testEnv.url
        const apiURL: string = testEnv.url3

        player = new AudioPlayer(dbConnectURL);
        await player.initialise(apiURL);
        isStarted = true;
        
        visualiser = new Visualiser(canvas);
        visualiser.setCanvas();


        function renderFrame(): void {
            const freqData: Uint8Array = player.getFrequencyData();
            visualiser.draw(freqData);
            requestAnimationFrame(renderFrame);  
        }
        await player.playNext();
        renderFrame();
        isAudioStarted.set(true);
    }
</script>
<canvas bind:this={canvas}></canvas>

{#if !isStarted} 
    <button on:click={startAudio}>Field Archive</button>
{/if}   
