import type { Meta, StoryObj } from "@storybook/react";

import ArmHeatmap from "./ArmHeatmap";

const meta: Meta<typeof ArmHeatmap> = {
  component: ArmHeatmap,
};

export default meta;

type Story = StoryObj<typeof ArmHeatmap>;

export const DefaultArmHeatmap: Story = {};
