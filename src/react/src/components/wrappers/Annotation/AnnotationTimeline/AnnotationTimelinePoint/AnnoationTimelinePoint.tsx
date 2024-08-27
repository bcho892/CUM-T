import { twMerge } from "tailwind-merge";

interface IAnnotationTimelinePoint {
  timestamp: string;
  selected?: boolean;
  onClick?: () => void;
}

const AnnoationTimelinePoint = ({
  timestamp,
  selected,
  onClick,
}: IAnnotationTimelinePoint) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "cursor-pointer min-w-[50px] h-[50px] flex items-center justify-center rounded-md",
        selected ? "bg-slate-400" : "bg-slate-500 hover:bg-slate-400",
      )}
    >
      <h5 className="text-white font-bold italic">{timestamp}</h5>
    </div>
  );
};

export default AnnoationTimelinePoint;
