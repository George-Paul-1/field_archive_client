<script lang="ts">
    import { onMount } from 'svelte';
    import { audioPlayer, initialiseAudioPlayer, isAudioPlaying } from '../stores/audio';

    onMount(() => {
        console.log('mounting player...')
        audioPlayer.subscribe(player => {
            if (!player) initialiseAudioPlayer();
        });
    });
</script>
<div>
    <div class="player">
    </div>
    <slot/>
</div>