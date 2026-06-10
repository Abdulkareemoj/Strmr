import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const short = pgTable("short", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  url: text("url").notNull(),
  duration: integer("duration"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  isPublic: boolean("isPublic").notNull().default(false),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
