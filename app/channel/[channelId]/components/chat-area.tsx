"use client"

import { assignRoomtoFile } from "@/server/actions/file"
import { UploadButton } from "@/utils/uploadthing"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { File } from "./call"

export default function ChatArea({ files, roomId }: { files: File[], roomId: string}) {
  const [fileList, setFiles] = useState<File[]>(files)
  return (
    <div className="file-share-area flex flex-col col-span-1 p-3">
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
