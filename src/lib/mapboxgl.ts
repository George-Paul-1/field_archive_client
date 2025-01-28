import mapboxgl from 'mapbox-gl'
import { testEnv } from '../environments/test'

mapboxgl.accessToken = testEnv.map;

const key = Symbol() 

export { mapboxgl, key }