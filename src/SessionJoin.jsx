import React, { useEffect, useRef } from "react";
import Peer from "peerjs";
import { useLocation } from "react-router-dom";

export default function Session() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const roomId = query.get("room");

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      localVideoRef.current.srcObject = stream;

      const peer = new Peer({
        host: "peerjs.com",
        port: 443,
        secure: true,
      });

      peer.on("open", () => {
        const call = peer.call(roomId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
    };

    init();
  }, [location]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Conectado à Sessão</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div>
          <h3>Você</h3>
          <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
        </div>
        <div>
          <h3>Remoto</h3>
          <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
        </div>
      </div>
    </div>
  );
}


