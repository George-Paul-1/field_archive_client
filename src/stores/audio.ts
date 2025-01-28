import { writable } from "svelte/store";
import { AudioPlayer } from "$lib"; 
import { testEnv } from "../environments/test";

export const audioPlayer = writable<AudioPlayer | null>(null) 
export const isAudioPlaying = writable<boolean>(false) 

export async function initialiseAudioPlayer() {
    const dbConnect = testEnv.url;
    const APIUrl = testEnv.url3;

    const player = new AudioPlayer(dbConnect);
    await player.initialise(APIUrl);
    audioPlayer.set(player) 
}