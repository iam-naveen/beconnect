import Call from "./components/call";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files, rooms, userToRoom } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page(
    { params }:
    {
      params: { channelId: string },
    }
) {

    const session = await auth()
    if (!session) {
        return redirect('/')
    }

    const [channel, fileList, isMember] = await db.batch([
        db.query.rooms.findFirst({
            where: eq(rooms.id, params.channelId)
        }),
        db.query.files.findMany({
            where: eq(files.roomId, params.channelId),
        }),
        db.query.userToRoom.findFirst({
            where: and(
                eq(userToRoom.userId, session.user.id),
                eq(userToRoom.roomId, params.channelId)
            )
        }),
    ])

    if (!isMember) {
        return redirect('/?error=You_are_not_a_member_of_this_channel.')
    }

    if (!channel || !channel.name) {
        return redirect('/?error=Channel_not_found.')
    }

    return (
        <main className="flex w-full flex-col relative">
            <p className="absolute top-2 left-2 z-10 py-2 px-4 text-2xl font-semibold bg-white rounded-full text-gray-900">
                {channel.name}
            </p>
            <Call files={fileList} appId={process.env.PUBLIC_AGORA_APP_ID!} userId={session.user.id} channel={channel}></Call>
        </main>
    )
}
