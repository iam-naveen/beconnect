"use client";

import AgoraRTC, { AgoraRTCProvider, useRTCClient, } from "agora-rtc-react";
import ChatArea from "./chat-area";
import Videos from "./videos";
import { rooms } from "@/server/db/schema";

export interface File {
  id: string
  name: string
  size: number
  type: string
  url: string
  key: string
  uploadedById: string
}

type channel = typeof rooms.$inferSelect

function Call(props: {
  appId: string;
  channel: channel,
  userId: string
  files: File[];
}) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <div className="grid grid-cols-4 w-full h-screen">
        <Videos channelName={props.channel.name ?? ""} AppID={props.appId} userId={props.userId} />
        <ChatArea files={props.files} roomId={props.channel.id} />
      </div>
    </AgoraRTCProvider>
  );
}


export default Call;
