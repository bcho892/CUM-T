import type { Meta, StoryObj } from "@storybook/react";

import TemperatureGraph from "./TemperatureGraph";
import { useState } from "react";
import { TemperatureGraphDataPoint } from "@/models/Graph";
import { Slider } from "@/components/ui/slider";

const meta: Meta<typeof TemperatureGraph> = {
  component: TemperatureGraph,
};

export default meta;

type Story = StoryObj<typeof TemperatureGraph>;

const DELTA_T = 0.05;
const mockData: TemperatureGraphDataPoint[] = [];

const MAX_VALUE = Math.pow(2, 16) - 1;

for (let i = 0; i < 50; ++i) {
  mockData.push({
    time: Math.round(i * DELTA_T * 100) / 100,
    peltier1Value: Math.random() * MAX_VALUE,
    peltier2Value: -Math.random() * MAX_VALUE,
    peltier3Value: Math.random() * MAX_VALUE,
    peltier4Value: -Math.random() * MAX_VALUE,
    peltier5Value: Math.random() * MAX_VALUE,
  });
}

export const DefaultTemperatureGraph: Story = {
  args: {
    data: mockData,
  },
};

export const TemperatureGraphWithTime: Story = {
  args: {
    data: mockData,
    currentTimestamp: 0.5,
  },
};

export const TemperatureGraphWithChangableTime = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  return (
    <>
      <Slider
        onValueChange={(value) => setCurrentTime(value[0])}
        min={0}
        max={DELTA_T * mockData.length}
        step={DELTA_T}
      />
      <TemperatureGraph data={mockData} currentTimestamp={currentTime} />
    </>
  );
};
