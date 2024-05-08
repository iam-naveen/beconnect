"use client"

import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useState } from "react";

export default function Videos(props: { channelName: string; AppID: string, userId: string }) {
  const { AppID, channelName, userId } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin(
    async () => {
      return await fetch( `/api/validate-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: channelName,
          user: userId,
          appid: AppID,
        }),
      })
      .then((res) => res.json())
      .catch((err) => console.error(err));
    }
  )

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="grid col-span-3 place-items-center">Loading devices...</div>
    );
  const unit = "minmax(0, 1fr) ";

  return (
    <div
      style={{
        gridTemplateColumns:
          remoteUsers.length > 9
            ? unit.repeat(4)
            : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
                ? unit.repeat(2)
                : unit,
      }}
      className={`grid relative col-span-3 gap-1`}
    >
      <LocalUser
        videoTrack={localCameraTrack}
        audioTrack={localMicrophoneTrack}
        cameraOn={video}
        micOn={audio}
        className="w-full h-full"
      />
      {remoteUsers.map((user) => (
        <RemoteUser user={user} />
      ))}
      <div className="absolute z-10 bottom-0 left-0 right-0 flex justify-center items-center pb-4 gap-3">
        <div className="cursor-pointer rounded-full border-2 p-3 border-white text-white">
        {video ? 
          <Video onClick={() => setVideo(false)} /> : 
          <VideoOff onClick={() => setVideo(true)} />}
        </div>
        <div className="cursor-pointer rounded-full border-2 p-3 border-white text-white">
        {audio ? 
          <Mic onClick={() => setAudio(false)} /> :
          <MicOff onClick={() => setAudio(true)} />}
        </div>
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </div>
  );
}
