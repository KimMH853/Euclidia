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
  console.log(shapes)
  // shapes에서 타입 line 이 3개  이상인가
  const lines = shapes.filter((shape) => shape.type === "line");
  if (lines.length < 3) return false;
  console.log("lines 갯수"+lines.length)
  //직선중에 길이가 같은 직선이 3개 이상인가
console.log("lines")
console.log(lines)
  const lineLengths = lines.map((line) =>
    getDistanceBetweenCoordinates(
      line.startX,
      line.startY,
      line.endX,
      line.endY
    )
  );
  console.log("lineLengths")
console.log(lineLengths)
  const targetLength = makeComparableValue(lineLengths[0]);
console.log("targetLength" + targetLength)
  const sameLengthLine = lineLengths.filter(
    (length) => makeComparableValue(length) === targetLength
  );
  if (sameLengthLine.length < 3) return false;
    console.log("sameLengthLine"+ sameLengthLine)
  //삼각형인지 확인하기

  const targetLine = lines.shift();
  if (!targetLine) return false;
console.log(targetLine)
  const otherCoord1 = {
    x: targetLine.startX + (targetLine.endX - targetLine.startX) / 2,
    y: targetLine.startY + (lineLengths[0] * Math.sqrt(3)) / 2,
  };
console.log(otherCoord1)
  const otherCoord2 = {
    x: targetLine.startX + (targetLine.endX - targetLine.startX) / 2,
    y: targetLine.startY - (lineLengths[0] * Math.sqrt(3)) / 2,
  };
  console.log(otherCoord2)

  const triangleOtherCoord1 = lines.filter(
    (line) =>
      (makeComparableValue(targetLine.startX) === makeComparableValue(line.startX) &&
      makeComparableValue(targetLine.startY) === makeComparableValue(line.startY) &&
      makeComparableValue(otherCoord1.x) === makeComparableValue(line.endX) &&
      makeComparableValue(otherCoord1.y) === makeComparableValue(line.endY)) ||
      (makeComparableValue(targetLine.startX) === makeComparableValue(line.endX) &&
        makeComparableValue(targetLine.startY) === makeComparableValue(line.endY) &&
        makeComparableValue(otherCoord1.x) === makeComparableValue(line.startX) &&
        makeComparableValue(otherCoord1.y) === makeComparableValue(line.startY)) ||
      (makeComparableValue(targetLine.endX) === makeComparableValue(line.startX) &&
        makeComparableValue(targetLine.endY) === makeComparableValue(line.startY) &&
        makeComparableValue(otherCoord1.x) === makeComparableValue(line.endX) &&
        makeComparableValue(otherCoord1.y) === makeComparableValue(line.endY)) ||
      (makeComparableValue(targetLine.endX) === makeComparableValue(line.endX) &&
        makeComparableValue(targetLine.endY) === makeComparableValue(line.endY) &&
        makeComparableValue(otherCoord1.x) === makeComparableValue(line.startX) &&
        makeComparableValue(otherCoord1.y) === makeComparableValue(line.startY))
  );
        console.log("triangleOtherCoord1")
  console.log(triangleOtherCoord1)
  const triangleOtherCoord2 = lines.filter(
    (line) =>
      (makeComparableValue(targetLine.startX) === makeComparableValue(line.startX) &&
      makeComparableValue(targetLine.startY) === makeComparableValue(line.startY) &&
      makeComparableValue(otherCoord2.x) === makeComparableValue(line.endX) &&
      makeComparableValue(otherCoord2.y) === makeComparableValue(line.endY)) ||
      (makeComparableValue(targetLine.startX) === makeComparableValue(line.endX) &&
      makeComparableValue(targetLine.startY) === makeComparableValue(line.endY) &&
      makeComparableValue(otherCoord2.x) === makeComparableValue(line.startX) &&
      makeComparableValue(otherCoord2.y) === makeComparableValue(line.startY)) ||
      (makeComparableValue(targetLine.endX) === makeComparableValue(line.startX) &&
      makeComparableValue(targetLine.endY) === makeComparableValue(line.startY) &&
      makeComparableValue(otherCoord2.x) === makeComparableValue(line.endX) &&
      makeComparableValue(otherCoord2.y) === makeComparableValue(line.endY)) ||
      (makeComparableValue(targetLine.endX) === makeComparableValue(line.endX) &&
      makeComparableValue(targetLine.endY) === makeComparableValue(line.endY) &&
      makeComparableValue(otherCoord2.x) === makeComparableValue(line.startX) &&
      makeComparableValue(otherCoord2.y) === makeComparableValue(line.startY))
  );
console.log("triangleOtherCoord2")
console.log(triangleOtherCoord2)
  if (triangleOtherCoord1.length === 2 && triangleOtherCoord2.length !== 2) {
    console.log("좌표1")
    return [targetLine, ...triangleOtherCoord1];
  } else if (triangleOtherCoord1.length !== 2 && triangleOtherCoord2.length === 2) {
    console.log("좌표2")
    return [targetLine, ...triangleOtherCoord2];
  } else if (triangleOtherCoord1.length === 2 && triangleOtherCoord2.length === 2) {
    console.log("좌표 두개")
    return [targetLine, ...triangleOtherCoord1, ...triangleOtherCoord2];
  } else {
    console.log("false")
    return false;
  }
};

export default equilateralTriangle;
