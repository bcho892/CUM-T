import type { Meta } from "@storybook/react";

import AppNavbar from "./AppNavbar";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof AppNavbar> = {
  component: AppNavbar,
};

export default meta;

export const DefaultAppNavbar = () => (
  <MemoryRouter>
    <AppNavbar />
  </MemoryRouter>
);
