import { useMemo } from "react";
import AnnoationTimelinePoint from "./AnnotationTimelinePoint/AnnoationTimelinePoint";
import { twMerge } from "tailwind-merge";

interface IAnnotationTimeline {
  length: number;
  audioTimestamp: number;
  deltaT: number;
  selectedTimestamp: number;
  onTimeClick?: (timestamp: number) => void;
  getAssociatedZone?: (timestamp: number) => number;
}

const ZONE_HEIGHT_PX = 20 as const;

const AnnotationTimeline = ({
  length,
  deltaT,
  onTimeClick,
  selectedTimestamp,
  audioTimestamp,
  getAssociatedZone,
}: IAnnotationTimeline) => {
  const ENUMERATED = useMemo(() => [...Array(length)], [length]);

  const renderZone = (associatedZone: number, isPositive: boolean) => (
    <div
      style={{
        height: Math.abs(associatedZone) * ZONE_HEIGHT_PX,
      }}
      className={twMerge(
        isPositive
          ? "bg-red-700 mt-auto rounded-t-md"
          : "bg-blue-700 rounded-b-md",
        "flex justify-center",
        isPositive ? "" : "items-end",
      )}
    >
      <h5 className="font-bold text-white">{associatedZone}</h5>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col min-w-full w-fit gap-3 p-3 bg-slate-300 rounded-md">
        <div className="flex gap-3 overflow-visible">
          {ENUMERATED.map((_, i) => {
            const timestamp = i * deltaT;
            const associatedZone = getAssociatedZone?.(timestamp) || 0;
            return (
              <div className="grid grid-rows-[210px_1fr] items-center">
                <div className="grid grid-rows-2">
                  {
                    <span
                      className={twMerge(associatedZone <= 0 && "invisible")}
                    >
                      {renderZone(associatedZone, true)}
                    </span>
                  }
                  {
                    <span
                      className={twMerge(associatedZone >= 0 && "invisible")}
                    >
                      {renderZone(associatedZone, false)}
                    </span>
                  }
                </div>
                <AnnoationTimelinePoint
                  selected={selectedTimestamp === timestamp}
                  timestamp={`${timestamp}s`}
                  onClick={() => onTimeClick?.(timestamp)}
                />
              </div>
            );
          })}
        </div>
        <div
          style={{ width: `${(audioTimestamp / length) * 100}%` }}
          className="bg-lime-500 transition-all h-2"
        />
      </div>
    </div>
  );
};

export default AnnotationTimeline;
