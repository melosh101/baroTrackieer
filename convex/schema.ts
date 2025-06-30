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
  })
});
 
export default schema;