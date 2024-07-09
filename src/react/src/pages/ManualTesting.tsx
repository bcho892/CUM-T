import { useCallback, useState } from "react";
import { Slider } from "@/components/ui/slider";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Logo from "../assets/logo.png";
import { DirectionMessage, TemperatureMessage } from "../models/Message";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import WebsocketUtils from "@/utils/WebsocketUtils";
import PeltierUtils, { Direction } from "@/utils/PeltierUtils";

const DEFAULT_PELTIER_VALUE = 0 as const;

function ManualTesting() {
  const { sendMessage, readyState } = useWebSocket(WebsocketUtils.SOCKET_URL, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: true,
  });

  const [currentTemperatureMessage, setCurrentTemperatureMessage] =
    useState<TemperatureMessage>({
      prefix: "temp",
      peltier1Value: DEFAULT_PELTIER_VALUE,
      peltier2Value: DEFAULT_PELTIER_VALUE,
      peltier3Value: DEFAULT_PELTIER_VALUE,
      peltier4Value: DEFAULT_PELTIER_VALUE,
      peltier5Value: DEFAULT_PELTIER_VALUE,
    });

  const [currentDirectionMessage, setCurrentDirectionMessage] =
    useState<DirectionMessage>({
      prefix: "dir",
      peltier1Direction: Direction.REVERSE,
      peltier2Direction: Direction.REVERSE,
      peltier3Direction: Direction.REVERSE,
      peltier4Direction: Direction.REVERSE,
      peltier5Direction: Direction.REVERSE,
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

  const connectionStatus = WebsocketUtils.connectionStatus[readyState];

  return (
    <div className="flex flex-col gap-2 w-full">
      <h1>Manual Testing</h1>
      <p>Set the desired configuration of the peltiers manually here</p>
      <span className="h-auto w-[500px]">
        {" "}
        <img src={Logo} />
      </span>
      <div className="grid grid-cols-1 w-full">
        <h2>Temperature Configuration</h2>
        <span>
          <Label htmlFor="peltier-1-value">Peltier 1 Value</Label>
          <Slider
            min={PeltierUtils.PELTIER_MIN_VALUE}
            max={PeltierUtils.PELTIER_MAX_VALUE}
            onValueChange={(value) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier1Value: value[0],
              })
            }
            id="peltier-1-value"
          />
        </span>

        <span>
          <Label htmlFor="peltier-2-value">Peltier 2 Value</Label>
          <Slider
            min={PeltierUtils.PELTIER_MIN_VALUE}
            max={PeltierUtils.PELTIER_MAX_VALUE}
            onValueChange={(value) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier2Value: value[0],
              })
            }
            id="peltier-2-value"
          />
        </span>

        <span>
          <Label htmlFor="peltier-3-value">Peltier 3 Value</Label>
          <Slider
            min={PeltierUtils.PELTIER_MIN_VALUE}
            max={PeltierUtils.PELTIER_MAX_VALUE}
            onValueChange={(value) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier3Value: value[0],
              })
            }
            id="peltier-3-value"
          />
        </span>

        <span>
          <Label htmlFor="peltier-4-value">Peltier 4 Value</Label>
          <Slider
            min={PeltierUtils.PELTIER_MIN_VALUE}
            max={PeltierUtils.PELTIER_MAX_VALUE}
            onValueChange={(value) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier4Value: value[0],
              })
            }
            id="peltier-4-value"
          />
        </span>

        <span>
          <Label htmlFor="peltier-5-value">Peltier 5 Value</Label>
          <Slider
            min={PeltierUtils.PELTIER_MIN_VALUE}
            max={PeltierUtils.PELTIER_MAX_VALUE}
            onValueChange={(value) =>
              setCurrentTemperatureMessage({
                ...currentTemperatureMessage,
                peltier5Value: value[0],
              })
            }
            id="peltier-5-value"
          />
        </span>
      </div>
      <span className="flex font-bold">
        Peltier 1: {peltier1Value}, Peltier 2: {peltier2Value}, Peltier 3:{" "}
        {peltier3Value}, Peltier 4: {peltier4Value}, Peltier 5: {peltier5Value}
      </span>

      <span>
        <Checkbox
          id="peltier-1-direction"
          onCheckedChange={(checked) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier1Direction: checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
        <Label htmlFor="peltier-1-direction">Peltier 1 Direction</Label>
      </span>

      <span>
        <Checkbox
          id="peltier-2-direction"
          onCheckedChange={(checked) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier2Direction: checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
        <Label htmlFor="peltier-2-direction">Peltier 2 Direction</Label>
      </span>

      <span>
        <Checkbox
          id="peltier-3-direction"
          onCheckedChange={(checked) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier3Direction: checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
        <Label htmlFor="peltier-3-direction">Peltier 3 Direction</Label>
      </span>

      <span>
        <Checkbox
          id="peltier-4-direction"
          onCheckedChange={(checked) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier4Direction: checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
        <Label htmlFor="peltier-4-direction">Peltier 4 Direction</Label>
      </span>

      <span>
        <Checkbox
          id="peltier-5-direction"
          onChange={(checked) =>
            setCurrentDirectionMessage({
              ...currentDirectionMessage,
              peltier5Direction: checked
                ? Direction.FORWARD
                : Direction.REVERSE,
            })
          }
        />
        <Label htmlFor="peltier-5-direction">Peltier 5 Direction</Label>
      </span>

      <span className="flex font-bold">
        Peltier 1: {peltier1Direction}, Peltier 2: {peltier2Direction}, Peltier
        3: {peltier3Direction}, Peltier 4: {peltier4Direction}, Peltier 5:{" "}
        {peltier5Direction}
      </span>

      <Button
        className="uppercase"
        onClick={handleSendConfigMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Send configuration
      </Button>

      <span>The WebSocket is currently {connectionStatus}</span>
    </div>
  );
}

export default ManualTesting;
