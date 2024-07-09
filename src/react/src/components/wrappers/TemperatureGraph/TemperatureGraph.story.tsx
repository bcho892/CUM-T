import type { Meta, StoryObj } from "@storybook/react";

import TemperatureGraph from "./TemperatureGraph";

const meta: Meta<typeof TemperatureGraph> = {
  component: TemperatureGraph,
};

export default meta;

type Story = StoryObj<typeof TemperatureGraph>;

const DELTA_T = 0.05;
const mockData = [];

const MAX_VALUE = Math.pow(2, 16) - 1;

for (let i = 0; i < 50; ++i) {
  mockData.push({
    time: i * DELTA_T,
    peltier1Value: Math.random() * MAX_VALUE,
    peltier2Value: Math.random() * MAX_VALUE,
    peltier3Value: Math.random() * MAX_VALUE,
    peltier4Value: Math.random() * MAX_VALUE,
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
