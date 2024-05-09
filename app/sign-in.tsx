import { signIn } from "@/server/auth"
 
export default function SignIn({message}: {message: string}) {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
      className="flex flex-col gap-3 bg-white text-black p-10 border rounded"
    >
      <label className="flex flex-col">
        Email
        <input className="border rounded px-4 py-2" name="email" type="email" />
      </label>
      <label className="flex flex-col">
        Password
        <input className="border rounded px-4 py-2" name="password" />
      </label>
      <button className="bg-blue-600 px-4 py-2 rounded text-white">Sign In</button>
      {message && <p className="text-red-500">{message}</p>}
    </form>
  )
}

