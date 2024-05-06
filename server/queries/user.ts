import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { randomBytes } from "crypto";

export async function getUserFromDb(email: string, password: string) {
  const res = await db.query.users.findFirst({
    where: and(
      eq(users.email, email),
      eq(users.password, password)
    ),
  });
  return res
}

export async function createNewUser(email: string, password: string) {
  const res = await db.insert(users).values({
      id: randomBytes(5).toString("hex"),
      email,
      password,
  }).returning();
  return res[0];
}
