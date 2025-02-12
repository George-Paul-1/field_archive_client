import { writable } from "svelte/store";
import { browser } from "$app/environment";

export let isFading = writable<boolean>(false)
export let isStarted = writable<boolean>(false)
export let navigating = writable<boolean>(false)
export let initialFade = writable<boolean>(false)

if (browser) {
    const storedIsFading = localStorage.getItem("isFading")
    isFading.set(storedIsFading ? JSON.parse(storedIsFading) : false);
    isFading.subscribe(value => {
        localStorage.setItem("isFading", JSON.stringify(value));
    })     

    const storedIsStarted = localStorage.getItem("isStarted")
    isStarted.set(storedIsStarted ? JSON.parse(storedIsStarted) : false);
    isStarted.subscribe(value => {
        localStorage.setItem("isStarted", JSON.stringify(value));
    })      

    const storedNavigating= localStorage.getItem("navigating")
    navigating.set(storedNavigating ? JSON.parse(storedNavigating) : false); 
    navigating.subscribe(value => {
        localStorage.setItem("navigating", JSON.stringify(value));
    })     

    const storedInitialFade= localStorage.getItem("initialFade")
    initialFade.set(storedInitialFade ? JSON.parse(storedInitialFade) : false); 
    initialFade.subscribe(value => {
        localStorage.setItem("initialFade", JSON.stringify(value));
    })     
}

