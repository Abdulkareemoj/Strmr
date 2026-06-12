import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const bookmark = pgTable(
  "bookmark",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contentId: text("contentId").notNull(),
    contentType: text("contentType", { enum: ["video", "short", "music"] }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("uq_user_content").on(table.userId, table.contentId)],
);
