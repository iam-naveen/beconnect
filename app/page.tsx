import SignIn from "./sign-in";
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { rooms, userToRoom } from '@/server/db/schema';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function Home(props: { searchParams: { error: string, message: string } }) {
  const session = await auth()
  const { error, message } = props.searchParams
  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-5 mt-20 text-4xl font-extrabold leading-none tracking-tight">
        <span className="text-blue-500">Beconnect</span>
      </h1>
      {!session && <SignIn message={message} />}
      {session && (
        <>
          <h2 className="text-xl font-bold">Join a Channel</h2>
          <form action={async (form) => {
            "use server"
            const channel = form.get('channel') as string
            const res = await db.query.rooms.findFirst({
              where: eq(rooms.name, channel)
            })
            if (!res) {
              return redirect(`/?error=Channel_${channel}_not_found.`)
            }
            return redirect(`/channel/${res.id}`)
          }}
            className='flex flex-col items-center mb-10'
          >
            {error && <p className="text-red-500">{error.replaceAll("_", " ")}</p>}
            <div className="flex items-center gap-2">
              <input
                className="bg-gray-200 border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-black leading-tight"
                id="inline-full-name"
                type="text"
                name="channel"
                placeholder="Enter channel name"
                required
              />
              <button className="text-center px-3 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500">Submit</button>
            </div>
          </form>
          <h2 className="text-xl font-bold">Create a New Channel</h2>
          <form action={async (form) => {
            "use server"
            const channel = randomBytes(8).toString('hex')
            const name = form.get('name') as string
            await db.insert(rooms).values({
              id: channel,
              name: name,
              createdById: session.user.id,
              createdAt: new Date()
            })
            .returning({id: rooms.id})
            .then(async room => {
              await db.insert(userToRoom).values({
                userId: session.user.id,
                roomId: room[0].id
              }).then(() => {
                return redirect(`/channel/${room[0].id}`)
              })
            })
          }}
            className="flex items-center gap-2"
          >
            <input
              className="bg-gray-200 border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-black leading-tight"
              id="inline-full-name"
              type="text"
              name="name"
              placeholder="Enter channel name"
              required
            />
            <button className="text-center px-3 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500">Submit</button>
          </form>
        </>
      )}
    </div>
  )
}
