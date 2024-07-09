import { ReadyState } from "react-use-websocket";

const WebsocketUtils = {
  connectionStatus: {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  },
  SOCKET_URL: "ws://192.168.4.1:80",
} as const;

export default WebsocketUtils;
