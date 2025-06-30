import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Button } from "./ui/button"
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { currentUser } from "@/convex/userFunctions";
import { UserButton } from "./userButton";

export default function AuthButtons() {
    
    const { signIn, signOut } = useAuthActions();
    return (
        <>
        <AuthLoading>
            <p>loading auth...</p>
        </AuthLoading>
        <Unauthenticated>
            <Button onClick={() => signIn("discord")}>
                Sign in with Discord
            </Button>
        </Unauthenticated>
        <Authenticated>
            <Button onClick={() => signOut()}>
                Sign out
            </Button>
            <UserButton/>
        </Authenticated>
        </>
    )
}
