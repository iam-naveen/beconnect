"use server"
import { db } from "../db"
import { eq } from "drizzle-orm"
import { files } from "../db/schema"

export async function assignRoomtoFile(roomId: string, fileId: string) {
  await db.update(files).set({ roomId }).where(eq(files.id, fileId))
  .catch((e) => {
    console.error(e)
  })
}
