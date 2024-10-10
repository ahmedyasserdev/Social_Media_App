import { currentUser } from "@/lib/actions/session.actions";
import streamServerClient from "@/lib/stream";

export async function GET() {
    try {
        const user = await currentUser();
            console.log("Calling get token for user:" , user?.id)
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });


        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60

        const issuedAt = Math.floor(Date.now() / 1000) - 60 ;
        
        const token = streamServerClient.createToken(user.id as string , expirationTime , issuedAt );  

        return Response.json({ token });

    }catch (error) {
        console.log( "[GET_TOKEN]" , error);
        return Response.json({ error: "Something went wrong" }, { status: 500 });
      }
}