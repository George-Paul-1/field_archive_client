<link href="./navstyle.css" rel="stylesheet"/>
<script lang="ts">
    import { goto } from '$app/navigation';
    import {isStarted, navigating, initialFade } from '../../stores/fades';
    import { page } from '$app/state';
   
   const url = page.url 

    const handleNavigation = (event: MouseEvent, href: string) => {
        initialFade.set(false);
        event.preventDefault(); 
        setTimeout(() => {
            goto(href); 
        }, 1000);
    }
</script>

<div>
    {#if $isStarted || url.pathname !== "/"} 
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
</div>
