import type { Meta, StoryObj } from "@storybook/react";

import ArousalGraph from "./ArousalGraph";
import { useState } from "react";
import { ArousalGraphDataPoint } from "@/models/Graph";
import { Slider } from "@/components/ui/slider";

const meta: Meta<typeof ArousalGraph> = {
  component: ArousalGraph,
};

export default meta;

type Story = StoryObj<typeof ArousalGraph>;

const DELTA_T = 0.05;
const mockData: ArousalGraphDataPoint[] = [];

for (let i = 0; i < 50; ++i) {
  mockData.push({
    time: Math.round(i * DELTA_T * 100) / 100,
    value: (Math.random() - 0.5) * 3,
  });
}

export const DefaultArousalGraph: Story = {
  args: {
    data: mockData,
  },
};

export const ArousalGraphWithTime: Story = {
  args: {
    data: mockData,
    currentTimestamp: 0.5,
  },
};

export const ArousalGraphWithChangableTime = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  return (
    <>
      <Slider
        onValueChange={(value) => setCurrentTime(value[0])}
        min={0}
        max={DELTA_T * mockData.length}
        step={DELTA_T}
      />
      <ArousalGraph data={mockData} currentTimestamp={currentTime} />
    </>
  );
};
