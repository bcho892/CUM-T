import { TOTAL_PELTIERS } from "@/utils/Transformers";
import { twMerge } from "tailwind-merge";

const TOTAL_ZONES = TOTAL_PELTIERS;
const STEP = 1 / TOTAL_PELTIERS;
const ENUMERATED_ZONES = [...Array(TOTAL_ZONES)];

const WRAPPER_STYLE = "flex w-full items-center gap-2" as const;

/**
 * Renders a single zone bar.
 *
 * @param index - The index of the zone.
 * @param color - The background color of the zone.
 * @param opacity - The opacity of the zone.
 * @param onClick - Handler for when the zone is clicked on
 * @returns The rendered zone bar.
 */
const renderZoneBar = (
  index: number,
  color: string,
  opacity: number,
  onClick?: () => void,
  selected?: boolean,
): JSX.Element => (
  <span className={WRAPPER_STYLE}>
    <h5>#{index}</h5>
    <div
      className={twMerge(
        "w-full h-6 rounded-md cursor-pointer hover:brightness-100",
        selected ? "brightness-100 font-bold" : "brightness-50",
      )}
      style={{ backgroundColor: color, opacity }}
      onClick={onClick}
    />
  </span>
);

interface IAnnotationLevelBar {
  /**
   * The zone that the currently selected value belongs to - note that:
   *
   * - 0 means off
   * - positive means a hot zone specified by a maximum of {@link TOTAL_ZONES}
   * - negative means a cold zone specified by a maximum of -1 * {@link TOTAL_ZONES}
   */
  selectedZone?: number;
  handleZoneChange?: (zone: number) => void;
}

/**
 * Renders a bar with annotation levels.
 *
 * @returns The rendered annotation level bar component.
 */
const AnnotationLevelBar = ({
  selectedZone = 0,
  handleZoneChange,
}: IAnnotationLevelBar): JSX.Element => {
  return (
    <div className="flex flex-row-reverse gap-2">
      {ENUMERATED_ZONES.map((_, i) => {
        // Note that the zones render from top down
        const zone = ENUMERATED_ZONES.length - i;

        return renderZoneBar(
          zone,
          "red",
          zone * STEP,
          () => handleZoneChange?.(zone),
          selectedZone === zone,
        );
      })}
      <span className={WRAPPER_STYLE}>
        <h5>Off</h5>
        <div
          onClick={() => handleZoneChange?.(0)}
          className={twMerge(
            "w-full h-6 rounded-md cursor-pointer hover:brightness-100 bg-gray-600",
            selectedZone === 0 ? "brightness-100 font-bold" : "brightness-50",
          )}
        />
      </span>
      {ENUMERATED_ZONES.map((_, i) => {
        const zone = i + 1;

        return renderZoneBar(
          zone,
          "blue",
          zone * STEP,
          () => handleZoneChange?.(zone * -1),
          // We treat "cold" zones as negative
          selectedZone === zone * -1,
        );
      })}
    </div>
  );
};

export default AnnotationLevelBar;
