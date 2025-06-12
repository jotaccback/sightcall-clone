import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";

export default function SessionCreate() {
  const localVideoRef = useRef(null);
  const peerRef = useRef(null);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
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

      peerRef.current = peer;

      peer.on("open", (id) => {
        setRoomId(id);
      });

      peer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          // já está funcionando, mas podemos exibir o vídeo remoto aqui se quiser
        });
      });
    };

    init();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Sessão de Vídeo Criada</h2>
      <p>Compartilhe este link com quem vai entrar:</p>
      <p>
        <strong>
          {window.location.origin + "/join?room=" + roomId}
        </strong>
      </p>
      <h3>Você</h3>
      <video ref={localVideoRef} autoPlay muted style={{ width: "60%" }} />
    </div>
  );
}


