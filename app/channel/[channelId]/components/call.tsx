"use client";

import AgoraRTC, { AgoraRTCProvider, useRTCClient, } from "agora-rtc-react";
import ChatArea from "./chat-area";
import Videos from "./videos";

export interface File {
  id: string
  name: string
  size: number
  type: string
  url: string
  key: string
  uploadedById: string
}

function Call(props: {
  appId: string;
  channelName: string,
  channelId: string
  token: string
  files: File[];
}) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <div className="grid grid-cols-4 w-full h-screen p-1">
        <Videos channelName={props.channelName} AppID={props.appId} token={props.token} />
        <ChatArea files={props.files} roomId={props.channelId} />
      </div>
    </AgoraRTCProvider>
  );
}


export default Call;
