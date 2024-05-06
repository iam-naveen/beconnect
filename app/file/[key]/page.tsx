import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files, userToRoom } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

async function ViewPage({ params }: { params: { key: string } }) {
  const { key } = params;

  const session = await auth()

  if (!session) {
    return <div>Unauthorized</div>
  }
  if (!key) {
    return <div>File not found</div>
  }
  const file = await db.query.files.findFirst({
    where: eq(files.key, key)
  })
  if (!file || !file.roomId) {
    return <div>File not found</div>
  }
  await db.query.userToRoom.findFirst({
    where: and(
      eq(userToRoom.userId, session.user.id),
      eq(userToRoom.roomId, file.roomId)
    )
  })
  return <div className="size-full object-contain">
    <img src={file.url} alt={file.name} className="size-full" />
  </div>
}

export default ViewPage
