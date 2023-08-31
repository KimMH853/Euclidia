import nerdamer from "nerdamer/all.js";
import makeComparableValue from "./makeComparableValue";
import getDistanceBetweenCoordinates from "./getDistanceBetweenCoordinates";

const getNewCoordinatesCircleAndCircle = (
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
) => {
  const distanceBetweenCircles = getDistanceBetweenCoordinates(x1, y1, x2, y2);
  const isTwoPoints =
    r1 + r2 > distanceBetweenCircles &&
    Math.abs(r1 - r2) < distanceBetweenCircles;

  if (isTwoPoints) {
    if (y1 === y2) {
      // x축 평행시
      let newXPoint;
      if (x1 > x2) {
        newXPoint = x2 + (x1 - x2) / 2;
      } else {
        newXPoint = x1 + (x2 - x1) / 2;
      }

      const newYPoint1 = y1 - (r1 * Math.sqrt(3)) / 2;
      const newYPoint2 = y1 + (r1 * Math.sqrt(3)) / 2;

      return [
        { x: newXPoint, y: newYPoint1 },
        { x: newXPoint, y: newYPoint2 },
      ];
    } else if (x1 === x2) {
      // y축 평행시

      let newYPoint;
      if (y1 > y2) {
        newYPoint = y2 + (y1 - y2) / 2;
      } else {
        newYPoint = y1 + (y2 - y1) / 2;
      }

      const newXPoint1 = x1 - (r1 * Math.sqrt(3)) / 2;
      const newXPoint2 = x1 + (r1 * Math.sqrt(3)) / 2;

      return [
        { x: newXPoint1, y: newYPoint },
        { x: newXPoint2, y: newYPoint },
      ];
    } else {
      const eq = `(x-${x1})^2+(y-${y1})^2-${r1}^2-(x-${x2})^2-(y-${y2})^2+${r2}^2`;
      const circleEq1 = `(x-${x1})^2+(y-${y1})^2-${r1}^2`;
      const circleEq2 = `(x-${x2})^2+(y-${y2})^2-${r2}^2`;
      //x좌표 구하기
      const lineEqY = nerdamer.solve(eq, "y");
      const solXEq = nerdamer(circleEq1, { y: lineEqY }).text();
      const solXEqSlice = solXEq.slice(1, -1);
      const solX = nerdamer.solve(solXEqSlice, "x").evaluate();
      const solXText = solX.text();
      const xArray = solXText.slice(1, -1).split(",").map(Number);

      //y좌표 구하기

      const yArray1: number[] = [];
      xArray.forEach((x: number) => {
        const solYEq = nerdamer(circleEq1, { x: x }).text();
        const solY = nerdamer.solve(solYEq, "y");
        const solYText = solY.text();

        const y = solYText.slice(1, -1).split(",").map(Number);
        yArray1.push(...y);
      });
      const yArray2: number[] = [];
      xArray.forEach((x: number) => {
        const solYEq = nerdamer(circleEq2, { x: x }).text();
        const solY = nerdamer.solve(solYEq, "y");
        const solYText = solY.text();

        const y = solYText.slice(1, -1).split(",").map(Number);
        yArray2.push(...y);
      });

      const yArray = yArray1.filter((val1) =>
        yArray2.some(
          (val2) => makeComparableValue(val1) === makeComparableValue(val2)
        )
      );

      return [
        { x: xArray[0], y: yArray[0] },
        { x: xArray[1], y: yArray[1] },
      ];
    }
  }
};

export default getNewCoordinatesCircleAndCircle;
