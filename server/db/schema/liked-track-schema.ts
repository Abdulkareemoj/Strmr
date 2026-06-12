import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { music } from "./music-schema";

export const likedTrack = pgTable(
  "liked_track",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    trackId: text("trackId")
      .notNull()
      .references(() => music.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("uq_user_track").on(table.userId, table.trackId)],
);
