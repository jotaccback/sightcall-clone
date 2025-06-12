import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Peer from "peerjs";

export default function SessionJoin() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room");

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      const call = peer.call(roomId, localVideoRef.current.srcObject);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
    });
  }, [roomId]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Você entrou na sessão</h2>

      <h3>Seu vídeo</h3>
      <video ref={localVideoRef} autoPlay muted playsInline width="300" />

      <h3>Vídeo remoto</h3>
      <video ref={remoteVideoRef} autoPlay playsInline width="300" />
    </div>
  );
}



