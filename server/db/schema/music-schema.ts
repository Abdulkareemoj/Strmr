import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const music = pgTable("music", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  album: text("album"),
  coverUrl: text("coverUrl"),
  url: text("url").notNull(),
  duration: integer("duration"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  isPublic: boolean("isPublic").notNull().default(false),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
