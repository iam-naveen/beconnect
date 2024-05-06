import { signIn } from "@/server/auth"
 
export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label className="text-white">
        Email
        <input className="text-black" name="email" type="email" />
      </label>
      <label className="text-white">
        Password
        <input className="text-black" name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}

