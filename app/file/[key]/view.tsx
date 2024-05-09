"use client"

import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export const View = () => {

  const { key } = useParams();
  const [verified, setVerified] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  return <div className="flex flex-col gap-2 items-center pt-52">
    {verified && file ?
      <div
        className="flex items-center gap-2 cursor-pointer border p-5 rounded-full text-sm font-semibold shadow-md"
        onClick={e => {
          e.preventDefault()
          // @ts-expect-error - file has url
          fetch(file.url).then(res => res.blob()).then(blob => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = file.name
            a.click()
          })
        }}
      >
        <Download size={32} className="text-blue-500" />
        {file.name}
      </div>
      : <>
        <h1 className="text-blue-500 text-3xl font-bold">Beconnect</h1>
        <p className="text-gray-500 text-sm">Please Enter the key to view the file</p>
        <form
          className="flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const token = formData.get('key')
            if (!token) return
            await fetch('/api/token/verify', {
              method: 'POST',
              body: JSON.stringify({ token, key }),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(async res => {
              if (res.ok) {
                const data = await res.json()
                setVerified(data.verified)
                setFile(data.file)
              } else {
                const text = await res.text()
                alert(text)
              }
            }).catch(err => {
              console.error(err)
              alert(err.message)
            })
          }}>
          <input
            className="bg-gray-200 border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-black leading-tight"
            id="key"
            type="text"
            name="key"
            placeholder="Enter key"
            required
          />
          <button type="submit" className="text-center w-full px-3 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500">Submit</button>
        </form>
      </>}
  </div>
}
