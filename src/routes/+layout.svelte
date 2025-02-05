<script lang="ts">
    import { onMount } from 'svelte';
    import { audioPlayer, initialiseAudioPlayer } from '../stores/audio';
    import { isFading, isStarted, navigating } from '../stores/fades';
    import 'mapbox-gl/dist/mapbox-gl.css'; 
    import Navbar from '../lib/components/navbar.svelte';

    onMount(() => {
        console.log('mounting layout...') 
        isFading.set(false)
        isStarted.set(false)
        navigating.set(false) 
        audioPlayer.subscribe(player => {
            if (!player) initialiseAudioPlayer();
        });   
        });
</script>
<Navbar /> 
<div class="player">
</div>
<slot/>
