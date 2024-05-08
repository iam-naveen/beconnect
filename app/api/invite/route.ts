import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userToRoom, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
     const session = await auth();
     if (!session) {
          return new Response("Unauthorized", { status: 401 });
     }

     const params = new URLSearchParams(req.url.split("?")[1]);
     const {room, email} = Object.fromEntries(params);

     const [eligible, invitedUser] = await db.batch([
          db.query.userToRoom.findFirst({
               where: and(
                    eq(userToRoom.userId, session.user.id),
                    eq(userToRoom.roomId, room as string)
               )
          }),
          db.query.users.findFirst({
               where: eq(users.email, email as string)
          })
     ]);
     if (!eligible || !invitedUser) {
          return new Response("You cannot invite this user", { status: 403 });
     }
     return await db.insert(userToRoom).values({
          userId: invitedUser.id as string,
          roomId: room as string
     }).then(_ => {
          return new Response("User invited", { status: 200 });
     }).catch((err) => {
          return new Response(err.message, { status: 500 });
     })
}
