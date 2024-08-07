import { Slider } from "@/components/ui/slider";
import { ReadyState } from "react-use-websocket";
import Logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import WebsocketUtils from "@/utils/WebsocketUtils";
import PeltierUtils, { Direction } from "@/utils/PeltierUtils";
import { useConfigMessageCallback } from "@/hooks/useConfigMessageCallback";
import { Switch } from "@/components/ui/switch";

const SLIDER_LIMITS = {
  min: PeltierUtils.MIN_DUTY_CYCLE,
  max: PeltierUtils.MAX_DUTY_CYCLE,
} as const;

function ManualTesting() {
  const {
    readyState,
    handleSendConfigMessage,
    setters: { setCurrentTemperatureMessage, setCurrentDirectionMessage },
    currentConfigs: { currentTemperatureMessage, currentDirectionMessage },
  } = useConfigMessageCallback();

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

  handleSendConfigMessage();

  const connectionStatus = WebsocketUtils.connectionStatus[readyState];

  return (
    <div className="flex flex-col gap-2 w-full">
      <h1>Manual Testing</h1>
      <p>Set the desired configuration of the peltiers manually here</p>
      <span className="h-auto w-[500px]">
        {" "}
        <img src={Logo} />
      </span>
      <h2>Configuration Settings</h2>
      <div className="grid-cols-1 md:grid-cols-2 grid gap-8 items-center">
        <div className="grid grid-cols-1 w-full">
          <h3>Duty Cycles</h3>
          <div>
            <span>
              <Label htmlFor="peltier-1-value">
                Peltier 1: {peltier1Value}
              </Label>
              <Slider
                {...SLIDER_LIMITS}
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
              <Label htmlFor="peltier-2-value">
                Peltier 2: {peltier2Value}
              </Label>
              <Slider
                {...SLIDER_LIMITS}
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
              <Label htmlFor="peltier-3-value">
                Peltier 3: {peltier3Value}
              </Label>
              <Slider
                {...SLIDER_LIMITS}
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
              <Label htmlFor="peltier-4-value">
                Peltier 4: {peltier4Value}
              </Label>
              <Slider
                {...SLIDER_LIMITS}
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
              <Label htmlFor="peltier-5-value">
                Peltier 5: {peltier5Value}
              </Label>
              <Slider
                {...SLIDER_LIMITS}
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
        </div>

        <div>
          <div className="flex flex-col">
            <h3>Directions</h3>
            <span>
              <Switch
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
              <Label htmlFor="peltier-1-direction">
                Peltier 1: {PeltierUtils.directionName(peltier1Direction)}
              </Label>
            </span>

            <span>
              <Switch
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
              <Label htmlFor="peltier-2-direction">
                Peltier 2: {PeltierUtils.directionName(peltier2Direction)}
              </Label>
            </span>

            <span>
              <Switch
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
              <Label htmlFor="peltier-3-direction">
                Peltier 3 {PeltierUtils.directionName(peltier3Direction)}
              </Label>
            </span>

            <span>
              <Switch
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
              <Label htmlFor="peltier-4-direction">
                Peltier 4: {PeltierUtils.directionName(peltier4Direction)}
              </Label>
            </span>

            <span>
              <Switch
                id="peltier-5-direction"
                onCheckedChange={(checked) => {
                  setCurrentDirectionMessage({
                    ...currentDirectionMessage,
                    peltier5Direction: checked
                      ? Direction.FORWARD
                      : Direction.REVERSE,
                  });
                }}
              />
              <Label htmlFor="peltier-5-direction">
                Peltier 5: {PeltierUtils.directionName(peltier5Direction)}
              </Label>
            </span>
          </div>
        </div>
      </div>

      <Button
        className="uppercase"
        onClick={handleSendConfigMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Send configuration
      </Button>

      <h4>The WebSocket is currently {connectionStatus}</h4>
    </div>
  );
}

export default ManualTesting;
