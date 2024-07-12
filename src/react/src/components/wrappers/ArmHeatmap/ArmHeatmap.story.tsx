import type { Meta, StoryObj } from "@storybook/react";

import ArmHeatmap from "./ArmHeatmap";
import PeltierUtils from "@/utils/PeltierUtils";

const meta: Meta<typeof ArmHeatmap> = {
  component: ArmHeatmap,
};

export default meta;

type Story = StoryObj<typeof ArmHeatmap>;

export const DefaultArmHeatmap: Story = {
  args: {
    currentTemperatureValues: {
      peltier1Value: PeltierUtils.PELTIER_MAX_VALUE * 0.5,
      peltier2Value: PeltierUtils.PELTIER_MAX_VALUE * 0.3,
      peltier3Value: -PeltierUtils.PELTIER_MAX_VALUE * 0.1,
      peltier4Value: PeltierUtils.PELTIER_MAX_VALUE * 0.9,
      peltier5Value: -PeltierUtils.PELTIER_MAX_VALUE * 0.6,
    },
  },
};
