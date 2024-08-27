import type { Meta, StoryObj } from "@storybook/react";

import AnnotationLevelBar from "./AnnotationLevelBar";

const meta: Meta<typeof AnnotationLevelBar> = {
  component: AnnotationLevelBar,
};

type Story = StoryObj<typeof AnnotationLevelBar>;

export default meta;

export const DefaultAnnotationLevelBar: Story = {
  args: {},
};
