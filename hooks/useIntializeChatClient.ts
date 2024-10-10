import { useCurrentUser } from "@/hooks/useCurrentUser";
import ky from "ky";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export const useIntializeChatClient = () => {
    const user = useCurrentUser();
    const [chatClient , setChatClient] = useState<StreamChat | null>(null);
        if (!user) return null;
    useEffect(() => {
            const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY as string);
            client.connectUser({
                id: user.id as string,
                name: user.displayName ,
                image: user.avatarUrl ,
            },
                async () => ky.get("/api/get-token").json<{token : string }>().then(({token}) => token)
        ).catch((error) => {
            console.error( "Failed To Connect To Chat Server" , error)
        }).then(() => setChatClient(client));


        return () => {
            setChatClient(null);
            client.disconnectUser().catch((error) => {
                console.error( "Failed To Disconnect From Chat Server" , error)
            }).then(() => console.log("Chat Client Disconnected Successfully."));
         
        }

    }, [user.id , user.displayName , user.avatarUrl]);

    return chatClient;
}