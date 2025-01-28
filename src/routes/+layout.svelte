<script lang="ts">
    import { onMount } from 'svelte';
    import { audioPlayer, initialiseAudioPlayer, isAudioPlaying } from '../stores/audio';

    onMount(() => {
        audioPlayer.subscribe(player => {
            if (!player) initialiseAudioPlayer();
        });
    });
</script>
<div>
    <div class="player">
        <p>Audio is {#if isAudioPlaying}playing{/if}{#if !isAudioPlaying}paused{/if}</p>
    </div>
    <slot/>
</div>
<style>
    .player {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px;
        border-radius: 8px;
    }
</style>