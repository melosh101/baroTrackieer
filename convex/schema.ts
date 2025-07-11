import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  // Your other tables...
  userMigrations: defineTable({
    userID: v.string(),
    isDone: v.boolean(),
  }),
  userSaveState: defineTable({
    userID: v.string(),
    ownedItems: v.array(v.string()),
  }),
  missingItem: defineTable({
    userID: v.optional(v.string()),
    itemName: v.string(),
    url: v.string(),
  }),
  feedback: defineTable({
    userID: v.optional(v.string()),
    email: v.optional(v.string()),
    feedbackText: v.string(),
  }),
});
 
export default schema;