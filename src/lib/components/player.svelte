<script>
    import { initialFade, isStarted } from "../../stores/fades";
    import { page } from "$app/state";

    var url = page.url;

</script>
{#if $isStarted || url.pathname !== "/"}  
<div class="player-container" class:fade-in={initialFade}>
    <img id="playicon" src="/play.png" alt="Play">
</div>
{/if}
<style>
    #playicon {
    width: 20px;
    height: 20px;
   
    } 
    .player-container {
        position: fixed;
        top: 12px; 
        right: 20px;
        z-index: 1001;
    }
</style>