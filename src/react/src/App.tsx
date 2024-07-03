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
      peltier3Value: 0,
      peltier4Value: 0,
      peltier5Value: 0,
    });

  const [currentDirectionMessage, setCurrentDirectionMessage] =
    useState<DirectionMessage>({
      prefix: "dir",
      peltier1Direction: Direction.FORWARD,
      peltier2Direction: Direction.FORWARD,
      peltier3Direction: Direction.FORWARD,
      peltier4Direction: Direction.FORWARD,
      peltier5Direction: Direction.FORWARD,
    });

  const {
    peltier1Value,
    peltier2Value,
    peltier3Value,
    peltier4Value,
    peltier5Value,
  } = currentTemperatureMessage;
  const {
    peltier1Direction,
    peltier2Direction,
    peltier3Direction,
    peltier4Direction,
    peltier5Direction,
  } = currentDirectionMessage;

  const handleSendConfigMessage = useCallback(() => {
    const directionMessage = `${peltier1Direction} ${peltier2Direction} ${peltier3Direction} ${peltier4Direction} ${peltier5Direction}`;
    const temperatureMessage = `${peltier1Value} ${peltier2Value} ${peltier3Value} ${peltier4Value} ${peltier5Value}`;
    sendMessage(`${directionMessage}\n${temperatureMessage}`);
  }, [
    sendMessage,
    peltier1Direction,
    peltier2Direction,
    peltier3Direction,
    peltier4Direction,
    peltier5Direction,
    peltier1Value,
    peltier2Value,
    peltier3Value,
    peltier4Value,
    peltier5Value,
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

        <span>
          <label htmlFor="peltier-3-value">Peltier 3 Value</label>
          <input
            type="range"
            min="0"
            max="65565"
            onChange={(e) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier3Value: e.target.valueAsNumber,
              })
            }
            id="peltier-3-value"
          />
        </span>

        <span>
          <label htmlFor="peltier-4-value">Peltier 4 Value</label>
          <input
            type="range"
            min="0"
            max="65565"
            onChange={(e) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier4Value: e.target.valueAsNumber,
              })
            }
            id="peltier-4-value"
          />
        </span>

        <span>
          <label htmlFor="peltier-5-value">Peltier 5 Value</label>
          <input
            type="range"
            min="0"
            max="65565"
            onChange={(e) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier5Value: e.target.valueAsNumber,
              })
            }
            id="peltier-5-value"
          />
        </span>
      </div>
      <span className="flex font-bold">
        Peltier 1: {peltier1Value}, Peltier 2: {peltier2Value}, Peltier 3:{" "}
        {peltier3Value}
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

      <span>
        <label htmlFor="peltier-3-direction">Peltier 3 Direction</label>
        <input
          type="checkbox"
          id="peltier-3-direction"
          onChange={(e) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier3Direction: e.target.checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
      </span>

      <span>
        <label htmlFor="peltier-4-direction">Peltier 4 Direction</label>
        <input
          type="checkbox"
          id="peltier-4-direction"
          onChange={(e) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier4Direction: e.target.checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
      </span>

      <span>
        <label htmlFor="peltier-5-direction">Peltier 5 Direction</label>
        <input
          type="checkbox"
          id="peltier-5-direction"
          onChange={(e) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier5Direction: e.target.checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
      </span>

      <span className="flex font-bold">
        Peltier 1: {peltier1Direction}, Peltier 2: {peltier2Direction}, Peltier
        3: {peltier3Direction}, Peltier 4: {peltier4Direction}, Peltier 5:{" "}
        {peltier5Direction}
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
