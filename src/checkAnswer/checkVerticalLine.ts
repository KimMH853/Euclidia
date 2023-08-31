import makeComparableValue from "../util/makeComparableValue";

type Coordinate = {
  tag?: string;
  x: number;
  y: number;
  selected?: boolean;
};

type Shape = {
  type?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  selected?: boolean;
};

const checkVerticalLine = (coordinates: Coordinate[], shapes: Shape[]) => {
  const coordC = coordinates.find((coord) => coord.tag === "C");
  if (coordC) {
    const verticalCoord = coordinates.filter(
      (coord) => makeComparableValue(coord.x) === makeComparableValue(coordC.x)
    );

    const lines = shapes.filter((shape) => shape.type === "line");

    if (lines) {
      const correctLines = lines.filter((line) =>
        verticalCoord.some(
          (coord) =>
            (makeComparableValue(line.startX) ===
              makeComparableValue(coord.x) &&
              makeComparableValue(line.startY) ===
                makeComparableValue(coord.y)) ||
            (makeComparableValue(line.endX) === makeComparableValue(coord.x) &&
              makeComparableValue(line.endY) === makeComparableValue(coord.y))
        )
      );
      console.log(correctLines);
      return correctLines;
    } else {
      return false;
    }
  }
  return false;
};

export default checkVerticalLine;
