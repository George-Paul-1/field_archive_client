<script lang="ts">
    import { isFading } from '../../stores/fades';  
    import { onDestroy, setContext} from 'svelte';
    import { mapboxgl, key } from '$lib';

    setContext(key, {
        getMap: () => map,
    });

    let map: mapboxgl.Map | null;

    function initMap(node: HTMLElement | string) {
        map = new mapboxgl.Map({
            container: node,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-103.5917, 40.6699],
			zoom: 3
        });
    }

    onDestroy(() => {
        if (map) map.remove();
    });
</script>
<section class="map_box_container">
    <div id='map' class:fade-in={$isFading} use:initMap></div>
</section>  
<style>
    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    .fade-in {
    animation: nav-fadein 1s linear forwards;
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