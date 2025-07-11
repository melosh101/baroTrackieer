import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createFeedback = mutation({
    args: {
        feedBackType: v.string(),
        data: v.any(),
    },
    handler: async (ctx, args) => {
        const user = await getAuthUserId(ctx);
        

        if(args.feedBackType === 'feedback') {
            await ctx.db.insert("feedback", {
                userID: user?? undefined,
                email: args.data.email || undefined,
                feedbackText: args.data.feedbackText,
            });
        } else if(args.feedBackType === 'missing item') {
            await ctx.db.insert("missingItem", {
                userID: user?? undefined,
                itemName: args.data.itemName,
                url: args.data.url,
            });
        }
    }
});