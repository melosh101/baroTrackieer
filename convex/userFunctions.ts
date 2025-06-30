import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
 
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const userMigration = mutation({
  args: {isDone: v.boolean()},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }
    // Check if the user migration already exists
    const mig = await ctx.db.query("userMigrations").filter((q) => q.eq(q.field("userID"), userId)).first();
    if(!mig) {
      await ctx.db.insert("userMigrations", {
        userID: userId,
        isDone: args.isDone,
      });
      return;
    }

    if(mig?.isDone == args.isDone) {
      return;
    }

    // Update the user migration
    await ctx.db.patch(mig._id, {
      isDone: args.isDone,
    });
    return;
  }
})


export const setUserSaveState = mutation({
  args: { ownedItems: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }
    // Check if the user save state already exists
    const saveState = await ctx.db.query("userSaveState").filter((q) => q.eq(q.field("userID"), userId)).first();
    if(!saveState) {
      await ctx.db.insert("userSaveState", {
        userID: userId,
        ownedItems: args.ownedItems,
      });
      return;
    }

    // Update the user save state
    await ctx.db.patch(saveState._id, {
      ownedItems: args.ownedItems,
    });
  }
});

export const getUserSaveState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    // Get the user save state
    const saveState = await ctx.db.query("userSaveState").filter((q) => q.eq(q.field("userID"), userId)).first();
    if(!saveState) {
      return null;
    }
    return saveState.ownedItems;
  }
});
