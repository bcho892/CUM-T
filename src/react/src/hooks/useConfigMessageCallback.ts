import { DirectionMessage, TemperatureMessage } from "@/models/Message";
import { DEFAULT_DIRECTIONS, DEFAULT_DUTY_CYCLES } from "@/utils/PeltierUtils";
import WebsocketUtils from "@/utils/WebsocketUtils";
import { useCallback, useState } from "react";
import useWebSocket from "react-use-websocket";

let lastTemperatureMessage: string;

/**
 * Hook that automatically sends new configuration messages as required
 * based ln changes to the peltier values and directions defined in
 * {@link currentTemperatureMessage} and {@link currentDirectionMessage}, which
 * can be changed through using the setter functions {@link setCurrentTemperatureMessage}
 * and {@link currentDirectionMessage}
 */
export const useConfigMessageCallback = () => {
  const { sendMessage, readyState } = useWebSocket(WebsocketUtils.SOCKET_URL, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    share: true,
  });

  const [currentTemperatureMessage, setCurrentTemperatureMessage] =
    useState<TemperatureMessage>(DEFAULT_DUTY_CYCLES);

  const [currentDirectionMessage, setCurrentDirectionMessage] =
    useState<DirectionMessage>(DEFAULT_DIRECTIONS);

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
    const message = `${directionMessage}\n${temperatureMessage}`;

    if (lastTemperatureMessage === message) {
      return;
    }

    lastTemperatureMessage = message;
    sendMessage(message);
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

  return {
    readyState,
    handleSendConfigMessage,
    setters: {
      setCurrentDirectionMessage,
      setCurrentTemperatureMessage,
    },
    currentConfigs: {
      currentTemperatureMessage,
      currentDirectionMessage,
    },
  };
};
