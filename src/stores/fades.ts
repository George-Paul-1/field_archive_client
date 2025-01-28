import { writable } from "svelte/store";

export let isFading = writable<boolean>(false)
export let isStarted = writable<boolean>(false)
export let navigating = writable<boolean>(false)
export let initialFade = writable<boolean>(false)

