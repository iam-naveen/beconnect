"use client"

import { assignRoomtoFile } from "@/server/actions/file"
import { UploadButton } from "@/utils/uploadthing"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { File } from "./call"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatArea({ files, roomId }: { files: File[], roomId: string}) {
  const [fileList, setFiles] = useState<File[]>(files)
  const [message, setMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)
  return (
    <div className="file-share-area flex flex-col col-span-1 p-3 bg-slate-900 gap-3">
      <Popover>
        <PopoverTrigger className="bg-white py-2 flex justify-center gap-2 rounded"><Plus />Invite</PopoverTrigger>
        <PopoverContent>
          <form className="space-y-2" onSubmit={async e => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email')
            if (!email) return
            await fetch(`/api/invite?room=${roomId}&email=${email}`).then(async res => {
              setMessage({type: res.ok ? 'success' : 'error', message: await res.text()})
            }).catch(err => {
              console.error(err)
              setMessage({type: 'error', message: err.message})
            })
          }}>
            {message &&
              <div className={cn("text-sm text-center", {
                "text-green-500": message.type === 'success',
                "text-red-500": message.type === 'error'
              })}>
                {message.message}
              </div>}
            <input className="bg-gray-200 border-2 rounded w-full py-2 px-4 text-black" id="email" type="text" name="email" placeholder="Enter email" required />
            <button className="text-center px-3 py-2 w-full text-white bg-blue-400 rounded hover:bg-blue-500">Submit</button>
          </form>
        </PopoverContent>
      </Popover>
      <div className="file-share-list flex flex-col gap-3 flex-1">
        {fileList.map((file) => (
          <div key={file.id} className="file-share-item flex rounded bg-white p-2 w-full">
            <Link className="w-fit shrink-0" href={`/file/${file.key}`} target="_blank" rel="noreferrer">
              <Image width={5} height={5} src={file.url} alt={file.id} className="w-20 h-20 aspect-square rounded" />
            </Link>
            <div className="flex flex-col h-full pl-2 justify-center gap-1 text-black">
              <div className="text-sm font-semibold truncate">{file.name}</div>
              <div className="text-xs">{file.size} bytes</div>
              <div className="text-xs">{file.type}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="file-share-input h-fit p-3">
        <UploadButton
          endpoint="chatArea"
          onClientUploadComplete={(data) => {
            data.forEach(({serverData}) => {
              assignRoomtoFile(roomId, serverData.id)
              setFiles(files => files.concat([serverData]))
            })
          }}
        />
      </div>
    </div>
  )
}
