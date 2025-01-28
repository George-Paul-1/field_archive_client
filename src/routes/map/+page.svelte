<script lang="ts">
    import { isFading } from '../../stores/fades';  
    import { onDestroy, setContext, onMount } from 'svelte';
    import { mapboxgl, key } from '$lib'; 

    setContext(key, {
        getMap: () => map,
    });

    let map: mapboxgl.Map | null;

    function initMap(container: HTMLElement | string) {
        map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-103.5917, 40.6699],
			zoom: 3
        });
    }

    onDestroy(() => {
        if (map) map.remove();
    });
</script>
<div class="map" class:fade-in={$isFading} use:initMap></div>
<style>
    .map {
      width: 100%;
      height: 1000px; /* Ensure the map has a height */
    }
    .fade-in {
    animation: nav-fadein 2s linear forwards;
    }
    @keyframes nav-fadein 
    {
        0% 
        {
            opacity:0;
            filter: blur(40px);
            font-color: #ffffff;
        }
        100% 
        {
            opacity:1;
            filter: blur(0px);
            font-color: #000000;
        }
    }
  </style>



