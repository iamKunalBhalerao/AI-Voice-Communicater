import { useRef, useState } from "react";

export function useVoiceAgent() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function start() {
    // setStatus("connecting");
    setLoading(true);
  }

  function stop() {
    setConnected(false);
  }

  return {
    // status,
    start,
    stop,
    connected,
    loading,
  };
}
