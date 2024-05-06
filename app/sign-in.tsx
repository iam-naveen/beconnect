import { signIn } from "@/server/auth"
 
export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
      className="flex flex-col gap-3"
    >
      <label className="text-white flex flex-col">
        Email
        <input className="text-black" name="email" type="email" />
      </label>
      <label className="text-white flex flex-col">
        Password
        <input className="text-black" name="password" type="password" />
      </label>
      <button className="bg-blue-300 text-black px-4 py-2 rounded">Sign In</button>
    </form>
  )
}

