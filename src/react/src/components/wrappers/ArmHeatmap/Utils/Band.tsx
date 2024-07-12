import { ReactNode } from "react";

interface IBand {
  /**
   * Y coordinates (px), positive going down
   */
  top?: number;
  /**
   * X Coordinates (px), positive going right
   */
  left?: number;

  /**
   * Width (px) of the band, note that the height is assumed to
   * follow an aspect ratio
   */
  width?: number;

  /**
   * Component to wrap and position in the grid
   */
  children?: ReactNode;
}
const Band = ({ top = 0, left = 0, width = 150, children }: IBand) => {
  return (
    <div className="absolute" style={{ left: left, top: top, width: width }}>
      {children}
    </div>
  );
};

export default Band;
