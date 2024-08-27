import type { Meta, StoryObj } from "@storybook/react";
import AnnotationTimeline from "./AnnotationTimeline";

const meta: Meta<typeof AnnotationTimeline> = {
  component: AnnotationTimeline,
};

type Story = StoryObj<typeof AnnotationTimeline>;

export default meta;

export const DefaultAnnotationTimeline: Story = {
  args: {
    length: 100,
    deltaT: 69,
  },
};
