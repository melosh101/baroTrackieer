import { convexAuth } from "@convex-dev/auth/server";
import Discord from "@auth/core/providers/discord";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Discord({
      id: "discord",
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
        };
      },
    })
  ],
});
