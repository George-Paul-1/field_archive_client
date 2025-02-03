<script lang="ts">
    import { onMount } from 'svelte';
    import { audioPlayer, initialiseAudioPlayer, isAudioPlaying } from '../stores/audio';
    import { isFading, isStarted, navigating, initialFade } from '../stores/fades';
    import { goto } from '$app/navigation';
    import 'mapbox-gl/dist/mapbox-gl.css'; 
    
    onMount(() => { 
        isFading.set(false)
        isStarted.set(false)
        navigating.set(false) 
        audioPlayer.subscribe(player => {
            if (!player) initialiseAudioPlayer();
        });   
    });
    const handleNavigation = (event: MouseEvent, href: string) => {
        initialFade.set(false);
        event.preventDefault(); 
        setTimeout(() => {
            goto(href); 
        }, 1000);

}
</script>
<link href="./navstyle.css" rel="stylesheet"/>
<div>
    {#if $isStarted} 
    <nav class:fade-in={$initialFade}>
        <ul>
            <li>
                <a href="/map" onclick={(event) => {
                    navigating.set(true);
                    handleNavigation(event, '/map')
                }}>Map</a>
            </li>
            <li>
                <a href="/" onclick={(event) => {
                    navigating.set(true);
                    handleNavigation(event, '/')
                }}>Home</a>
            </li>
        </ul>
    </nav>
    {/if}
    <div class="player">
    </div>
    <slot/>
</div>
