<script lang="ts">
    import { AudioManager, Visualiser } from "$lib";
    import { isAudioStarted } from "$lib/stores";
    import { get } from "svelte/store";
    import { testEnv } from "../environments/test";
    
    let canvas: HTMLCanvasElement;
    let manager: AudioManager;
    let visualiser: Visualiser;

    let isStarted: boolean;
    $: isAudioStarted.subscribe(value => isStarted = value);

    const startAudio = async() => {
        if (isStarted) return; 
        
        const URL: string = testEnv.url

        manager = new AudioManager(URL);
        visualiser = new Visualiser(canvas);

        visualiser.setCanvas();
        // await manager.fetchAudioIDs();
        // await manager.fetchAudioURL();
        // await manager.play()
        await manager.start()
        isStarted = true;

        function renderFrame(): void {
            const freqData: Uint8Array = manager.getFrequencyData();
            visualiser.draw(freqData);
            requestAnimationFrame(renderFrame);  
        }
        renderFrame();
        isAudioStarted.set(true);
    }
</script>
<canvas bind:this={canvas}></canvas>

{#if !isStarted} 
    <button on:click={startAudio}>Field Archive</button>
{/if}   

<style>
    canvas {
        display: block;
        width: 100%;
        height: 100%;
    }
    button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 15px 30px;
        font-size: 16px;
        background-color: #ffffff;
        color: rgb(0, 0, 0);
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    button:hover {
        background-color: #ffffff;
    }
</style>