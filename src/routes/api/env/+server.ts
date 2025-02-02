import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export async function GET() {
    return json({
        url: env.URL, 
        url3: env.URL3
    })
}