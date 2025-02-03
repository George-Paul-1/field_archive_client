import { json } from "@sveltejs/kit";
import { URL, URL2 } from "$env/static/private";

export async function GET({url}) {
    let id = url.searchParams.get('id');
    const response = await fetch(URL + `/${id}`);
    let track = await response.json(); 

    let loc = track.AudioLocation; 
    const bufResponse = await fetch(URL2 + loc); 
    return bufResponse  
}