// VideoCall.jsx
import React, { useEffect, useRef } from 'react';

export default function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerRef.current = new RTCPeerConnection();

      stream.getTracks().forEach(track => {
        peerRef.current.addTrack(track, stream);
      });

      peerRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    };

    startCall();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', gap: '2rem' }}>
      <div>
        <h3>Você</h3>
        <video ref={localVideoRef} autoPlay muted style={{ width: '300px', borderRadius: '8px' }} />
      </div>
      <div>
        <h3>Remoto</h3>
        <video ref={remoteVideoRef} autoPlay style={{ width: '300px', borderRadius: '8px' }} />
      </div>
    </div>
  );
}
