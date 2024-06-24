import { useCallback, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Logo from "./assets/logo.png";
import {
  Direction,
  DirectionMessage,
  TemperatureMessage,
} from "./models/Message";

const SOCKET_URL = "ws://192.168.4.1:80";

function App() {
  const { sendMessage, readyState } = useWebSocket(SOCKET_URL, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const [currentTemperatureMessage, setCurrentTemperatureMessage] =
    useState<TemperatureMessage>({
      prefix: "temp",
      peltier1Value: 0,
      peltier2Value: 0,
    });

  const [currentDirectionMessage, setCurrentDirectionMessage] =
    useState<DirectionMessage>({
      prefix: "dir",
      peltier1Direction: Direction.FORWARD,
      peltier2Direction: Direction.FORWARD,
    });

  const { peltier1Value, peltier2Value } = currentTemperatureMessage;
  const { peltier1Direction, peltier2Direction } = currentDirectionMessage;

  const handleSendConfigMessage = useCallback(() => {
    sendMessage(
      `${peltier1Direction} ${peltier2Direction}\n${peltier1Value} ${peltier2Value}`,
    );
  }, [
    sendMessage,
    peltier1Direction,
    peltier2Direction,
    peltier1Value,
    peltier2Value,
  ]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="flex flex-col items-center gap-2">
      <h1>Testing</h1>
      <img src={Logo} />
      <div className="grid grid-cols-1">
        <span>
          <label htmlFor="peltier-1-value">Peltier 1 Value</label>
          <input
            type="range"
            min="0"
            max="65565"
            onChange={(e) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier1Value: e.target.valueAsNumber,
              })
            }
            id="peltier-1-value"
          />
        </span>
        <span>
          <label htmlFor="peltier-2-value">Peltier 2 Value</label>
          <input
            type="range"
            min="0"
            max="65565"
            onChange={(e) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier2Value: e.target.valueAsNumber,
              })
            }
            id="peltier-2-value"
          />
        </span>
      </div>
      <span className="flex font-bold">
        Peltier 1: {peltier1Value}, Peltier 2: {peltier2Value}
      </span>

      <span>
        <label htmlFor="peltier-1-direction">Peltier 1 Direction</label>
        <input
          type="checkbox"
          id="peltier-1-direction"
          onChange={(e) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier1Direction: e.target.checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
      </span>

      <span>
        <label htmlFor="peltier-2-direction">Peltier 2 Direction</label>
        <input
          type="checkbox"
          id="peltier-2-direction"
          onChange={(e) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier2Direction: e.target.checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
      </span>

      <span className="flex font-bold">
        Peltier 1: {peltier1Direction}, Peltier 2: {peltier2Direction}
      </span>

      <button
        className="uppercase"
        onClick={handleSendConfigMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Send configuration
      </button>

      <span>The WebSocket is currently {connectionStatus}</span>
    </div>
  );
}

export default App;
