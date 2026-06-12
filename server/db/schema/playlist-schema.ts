import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const playlist = pgTable("playlist", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverUrl: text("coverUrl"),
  isPublic: boolean("isPublic").notNull().default(false),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const playlistTrack = pgTable("playlist_track", {
  id: text("id").primaryKey(),
  playlistId: text("playlistId")
    .notNull()
    .references(() => playlist.id, { onDelete: "cascade" }),
  trackId: text("trackId").notNull(),
  position: integer("position").notNull().default(0),
  addedAt: timestamp("addedAt").notNull().defaultNow(),
});
