import type { Meta } from "@storybook/react";
import MusicPlayer from "./MusicPlayer";
import { useState } from "react";

const meta: Meta<typeof MusicPlayer> = {
  component: MusicPlayer,
};

export default meta;

export const DefaultMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  return (
    <MusicPlayer
      isPlaying={isPlaying}
      play={() => setIsPlaying(true)}
      pause={() => setIsPlaying(false)}
    />
  );
};
