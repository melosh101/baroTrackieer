import { currentUser } from "@/convex/userFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const UserButton = () => {

    const user = useQuery(api.userFunctions.currentUser);
    return (
            <Avatar>
                <AvatarImage src={user?.image}/>
                <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
    )
}