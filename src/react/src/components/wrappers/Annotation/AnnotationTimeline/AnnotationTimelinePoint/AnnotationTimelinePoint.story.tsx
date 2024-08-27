import type { Meta, StoryObj } from "@storybook/react";
import AnnoationTimelinePoint from "./AnnoationTimelinePoint";

const meta: Meta<typeof AnnoationTimelinePoint> = {
  component: AnnoationTimelinePoint,
};

type Story = StoryObj<typeof AnnoationTimelinePoint>;

export default meta;

export const DefaultAnnotationTimelinePoint: Story = {
  args: {
    timestamp: "1s",
  },
};
