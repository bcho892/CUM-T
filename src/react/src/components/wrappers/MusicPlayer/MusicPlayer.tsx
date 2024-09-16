import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

let a: HTMLAudioElement;

type AudioStates = "playing" | "paused" | "no-file";

interface IMusicPlayer {
  /**
   * Callback when the pause button is clicked
   */
  pause?: () => void;
  /**
   * Callback when the play button is clicked
   */
  play?: () => void;
  /**
   * Callback which is called to check if the uploaded audio file is valid
   */
  onFileValidityChange?: (isValid: boolean) => void;
  /**
   * Callback to handle filepath of uploaded file changing
   *
   * @param src the file path of a successfully uploaded audio file
   */
  onFileChange?: (src: string) => void;
  /**
   * Whether the audio should play or not - which lets the playing status
   * be controlled by the consumer of this component
   */
  isPlaying?: boolean;
  /**
   * Displays the play button for the custom control mechanism
   */
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

  const [audioSrc, setAudioSrc] = useState<string>();

  useEffect(() => {
    if (a) {
      a.pause();
      setCurrentAudioState("paused");
    }
    if (audioSrc) {
      a = new Audio(audioSrc);
      a.onended = () => {
        setCurrentAudioState("paused");
      };
    }
  }, [audioSrc]);

  useEffect(() => {
    if (!audioSrc) {
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
  }, [isPlaying, audioSrc]);

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
      setAudioSrc(src);
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
