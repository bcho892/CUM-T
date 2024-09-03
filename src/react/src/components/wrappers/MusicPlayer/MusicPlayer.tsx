import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

let a: HTMLAudioElement;

type AudioStates = "playing" | "paused" | "no-file";

interface IMusicPlayer {
  pause?: () => void;
  play?: () => void;
  onFileValidityChange?: (isValid: boolean) => void;
  onFileChange?: (src: string) => void;
  isPlaying?: boolean;
  showPlayButton?: boolean;
}

const MusicPlayer = ({
  play,
  pause,
  isPlaying,
  onFileValidityChange,
  onFileChange,
  showPlayButton,
}: IMusicPlayer) => {
  const [currentAudioState, setCurrentAudioState] =
    useState<AudioStates>("no-file");

  const [audio, setAudio] = useState<string>();

  useEffect(() => {
    if (a) {
      a.pause();
      setCurrentAudioState("paused");
    }
    if (audio) {
      a = new Audio(audio);
      a.onended = () => {
        setCurrentAudioState("paused");
      };
    }
  }, [audio]);

  useEffect(() => {
    if (!audio) {
      setCurrentAudioState("no-file");
      return;
    }
    if (isPlaying) {
      setCurrentAudioState("playing");
      a.play();
    } else {
      setCurrentAudioState("paused");
      a.pause();
    }
  }, [isPlaying, audio]);

  const handleClick = () => {
    switch (currentAudioState) {
      case "playing":
        pause?.();
        break;
      case "paused":
        play?.();
        break;
      case "no-file":
        break;
    }
  };

  const buttonText = useMemo(() => {
    switch (currentAudioState) {
      case "playing":
        return "Pause";
      case "paused":
        return "Play";
      case "no-file":
        return "Upload File First";
    }
  }, [currentAudioState]);

  const addFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files && e.target?.files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setAudio(src);
      onFileChange?.(src);

      setCurrentAudioState("paused");
      onFileValidityChange?.(true);
    } else {
      onFileValidityChange?.(false);
    }
  };

  return (
    <span className="flex gap-2">
      {showPlayButton && (
        <Button
          onClick={handleClick}
          disabled={currentAudioState === "no-file"}
        >
          {buttonText}
        </Button>
      )}
      <span>
        <Label htmlFor="upload">Select Music</Label>
        <Input type="file" name="upload" onChange={addFile} accept="audio/*" />
      </span>
    </span>
  );
};

export default MusicPlayer;
