"use client"

import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

export default function Videos(props: { channelName: string; AppID: string, token: string }) {
  const { AppID, channelName, token } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: token ?? null,
  });

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
      <LocalVideoTrack
        track={localCameraTrack}
        play={true}
        className="w-full h-full"
      />
      {remoteUsers.map((user) => (
        <RemoteUser user={user} />
      ))}
      <div className="absolute z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
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
