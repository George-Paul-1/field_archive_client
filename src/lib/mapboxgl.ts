import mapboxgl from 'mapbox-gl'
import { PUBLIC_MAP } from '$env/static/public'

mapboxgl.accessToken = PUBLIC_MAP

const key = Symbol() 

export { mapboxgl, key }