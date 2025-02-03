import { URL5 } from '$env/static/private'
import { json, error } from '@sveltejs/kit'

export async function GET() {
    const response = await fetch(URL5); 
    if (!response.ok) {
        const err = await response.json()
        error(500, err.error.message);
    }
    const data = await response.json(); 
    return json({count: data})
}