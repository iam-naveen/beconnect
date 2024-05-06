import Call from "./components/call";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files, rooms } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page(
    { params, searchParams }:
    {
      params: { channelId: string },
      searchParams: { token: string }
    }
) {

    const session = await auth()
    if (!session) {
        return redirect('/')
    }

    const [channel, fileList] = await db.batch([
        db.query.rooms.findFirst({
            where: eq(rooms.id, params.channelId)
        }),
        db.query.files.findMany({
            where: eq(files.roomId, params.channelId),
        })
    ])

    if (!channel || !channel.name) {
        return redirect('/?error=Channel_not_found.')
    }

    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                {channel.name}
            </p>
            <Call files={fileList} appId={process.env.PUBLIC_AGORA_APP_ID!} token={searchParams.token} channelId={channel.id} channelName={channel.name}></Call>
        </main>
    )
}
