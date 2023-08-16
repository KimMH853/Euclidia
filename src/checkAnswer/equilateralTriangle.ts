import getDistanceBetweenCoordinates from "../util/getDistanceBetweenCoordinates";
import makeComparableValue from "../util/makeComparableValue";

type Shape = {
  type?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  selected?: boolean;
};

const equilateralTriangle = (shapes: Shape[]) => {
  console.log("shapes")
  console.log(shapes)
  // shapes에서 타입 line 이 3개  이상인가
  const lines = shapes.filter((shape) => shape.type === "line");
  if (lines.length < 3) return false;
  console.log("lines")
  console.log(lines)
  //직선중에 길이가 같은 직선이 3개 이상인가

  const lineLengths = lines.map((line) =>
    getDistanceBetweenCoordinates(
      line.startX,
      line.startY,
      line.endX,
      line.endY
    )
  );

  const targetLength = makeComparableValue(lineLengths[0]);
 
  const sameLengthLine = lineLengths.filter(
    (length) => makeComparableValue(length) === targetLength
  );
  if (sameLengthLine.length < 3) return false;

  //삼각형인지 확인하기

  const targetLine = lines.shift();
  if (!targetLine) return false;
console.log("targetLine")
console.log(targetLine)
  const otherCoord1 = {
    x: targetLine.startX + (targetLine.endX - targetLine.startX) / 2,
    y: targetLine.startY + (lineLengths[0] * Math.sqrt(3)) / 2,
  };
  console.log("otherCoord1")
  console.log(otherCoord1)

  const otherCoord2 = {
    x: targetLine.startX + (targetLine.endX - targetLine.startX) / 2,
    y: targetLine.startY - (lineLengths[0] * Math.sqrt(3)) / 2,
  };
  console.log("otherCoord2")
  console.log(otherCoord2)

  const triangleOtherCoord1 = lines.filter(
    (line) =>
      (targetLine.startX === line.startX &&
        targetLine.startY === line.startY &&
        otherCoord1.x === line.endX &&
        otherCoord1.y === line.endY) ||
      (targetLine.startX === line.endX &&
        targetLine.startY === line.endY &&
        otherCoord1.x === line.startX &&
        otherCoord1.y === line.startY) ||
      (targetLine.endX === line.startX &&
        targetLine.endY === line.startY &&
        otherCoord1.x === line.endX &&
        otherCoord1.y === line.endY) ||
      (targetLine.endX === line.endX &&
        targetLine.endY === line.endY &&
        otherCoord1.x === line.startX &&
        otherCoord1.y === line.startY)
  );
  console.log("triangleOtherCoord1")
  console.log(triangleOtherCoord1)
  const triangleOtherCoord2 = lines.filter(
    (line) =>
      (targetLine.startX === line.startX &&
        targetLine.startY === line.startY &&
        otherCoord2.x === line.endX &&
        otherCoord2.y === line.endY) ||
      (targetLine.startX === line.endX &&
        targetLine.startY === line.endY &&
        otherCoord2.x === line.startX &&
        otherCoord2.y === line.startY) ||
      (targetLine.endX === line.startX &&
        targetLine.endY === line.startY &&
        otherCoord2.x === line.endX &&
        otherCoord2.y === line.endY) ||
      (targetLine.endX === line.endX &&
        targetLine.endY === line.endY &&
        otherCoord2.x === line.startX &&
        otherCoord2.y === line.startY)
  );
console.log("triangleOtherCoord2")
console.log(triangleOtherCoord2)
  if (triangleOtherCoord1.length === 2 && triangleOtherCoord2.length !== 2) {
    return [targetLine, ...triangleOtherCoord1];
  } else if (triangleOtherCoord1.length !== 2 && triangleOtherCoord2.length === 2) {
    return [targetLine, ...triangleOtherCoord2];
  } else if (triangleOtherCoord1.length === 2 && triangleOtherCoord2.length === 2) {
    return [targetLine, ...triangleOtherCoord1, ...triangleOtherCoord2];
  } else {
    return false;
  }
};

export default equilateralTriangle;
