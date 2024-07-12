import { twMerge } from "tailwind-merge";
import { IBandSVG } from "./BandSvg";
import { ReactNode } from "react";

interface IBandLabel extends Pick<IBandSVG, "labelPosition"> {
  show?: boolean;
  children?: ReactNode;
}

const BandLabel = ({ labelPosition, show, children }: Readonly<IBandLabel>) => {
  return (
    <>
      {show && (
        <>
          <div
            className={twMerge(
              "absolute w-2 h-2 bg-gray-900 rounded-[50%]",
              labelPosition === "left" && "left-3 top-2",
              labelPosition === "right" && "right-4 bottom-3",
            )}
          >
            <div
              className={twMerge(
                "w-20 h-[2px] absolute bg-black rotate-45",
                labelPosition === "left" && "-left-16 -top-6",
                labelPosition === "right" && "-right-16 -bottom-6",
              )}
            />
            <div
              className={twMerge(
                "w-20 h-12 border-black border-2 absolute",
                `${labelPosition === "left" && "-left-[130px] -top-[99px]"}`,
                `${labelPosition === "right" && "-right-[130px] -bottom-[99px]"}`,
              )}
            >
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BandLabel;
