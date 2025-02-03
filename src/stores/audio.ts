import { writable } from "svelte/store";
import { AudioPlayer } from "$lib"; 

export const audioPlayer = writable<AudioPlayer | null>(null) 
export const isAudioPlaying = writable<boolean>(false) 

export async function initialiseAudioPlayer() { 
    const player = new AudioPlayer();
    await player.initialise();
    audioPlayer.set(player) 
}