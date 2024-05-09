import { db } from "@/server/db"
import { files, userToRoom } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
     const { token, key } = await req.json()
     const file = await db.query.files.findFirst({
          where: eq(files.key, key)
     })
     if (!file || !file.roomId) {
          return new Response('File not found', { status: 404 })
     }
     const allowed = await db.query.userToRoom.findFirst({
          where: and(
               eq(userToRoom.userId, token),
               eq(userToRoom.roomId, file.roomId)
          )
     })
     if (allowed === undefined) {
          return new Response('Unauthorized', { status: 401 })
     }
     return Response.json({ verified: true, file })
}
