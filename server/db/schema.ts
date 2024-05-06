import { relations } from "drizzle-orm";
import {
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  integer
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `mumble_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
}));

export const files = createTable("file", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  size: integer("size").notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  roomId: varchar("roomId", { length: 255 }),
  uploadedById: varchar("uploadedById", { length: 255 }).notNull().references(() => users.id, {
    onUpdate: "cascade",
  }),
  uploadedAt: timestamp("uploadedAt", { mode: "date" }).defaultNow(),
});

export const filesRelations = relations(files, ({ one }) => ({
  uploadedBy: one(users, { fields: [files.uploadedById], references: [users.id] }),
  room: one(rooms, { fields: [files.roomId], references: [rooms.id] }),
}));

export const rooms = createTable("room", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  createdById: varchar("createdById", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  createdBy: one(users, { fields: [rooms.createdById], references: [users.id] }),
  members: many(users),
  files: many(files),
}));

export const userToRoom = createTable("userToRooom", {
  userId: varchar("userId", { length: 255 }) .references(() => users.id, {
    onDelete: "cascade", onUpdate: "cascade" 
  }) .notNull(),
  roomId: varchar("roomId", { length: 255 }).references(() => rooms.id, { 
    onDelete: "cascade", onUpdate: "cascade"
  }).notNull()},
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roomId] }),
  })
);

export const userToRoomRelations = relations(userToRoom, ({ one }) => ({
  room: one(rooms, { fields: [userToRoom.roomId], references: [rooms.id] }),
  user: one(users, { fields: [userToRoom.userId], references: [users.id] }),
}))
