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
const isTriangle=(p1:Shape, p2:Shape, p3:Shape)=> {
  // Calculate distances between points
  const d1 = getDistanceBetweenCoordinates(p1.startX, p1.startY, p2.startX, p2.startY);
  const d2 = getDistanceBetweenCoordinates(p2.startX, p2.startY, p3.startX, p3.startY);
  const d3 = getDistanceBetweenCoordinates(p3.startX, p3.startY, p1.startX, p1.startY);

  // Check triangle inequality: the sum of any two sides must be greater than the third side
  return d1 + d2 > d3 && d2 + d3 > d1 && d3 + d1 > d2;
}

const equilateralTriangle = (shapes: Shape[]) => {
 
  // shapes에서 타입 line 이 3개  이상인가
  const lines = shapes.filter((shape) => shape.type === "line");
  if (lines.length < 3) return false;

  //직선중에 길이가 같은 직선이 3개 이상인가

  const lineLengths = lines.map((line) =>
    getDistanceBetweenCoordinates(line.startX, line.startY, line.endX, line.endY)
  );

  const targetLength = makeComparableValue(lineLengths[0]); // Take the length of the first line for comparison

  const sameLengthLineCount = lineLengths.filter(
    (length) => makeComparableValue(length) === targetLength
  ).length;

  if (sameLengthLineCount < 3) return false;

  //삼각형인지 확인하기

  let isTriangleFormed = false;
  let triangleArray: Shape[] = [];
  for (let i = 0; i < lines.length - 2; i++) {
    for (let j = i + 1; j < lines.length - 1; j++) {
      for (let k = j + 1; k < lines.length; k++) {
        if (isTriangle(lines[i], lines[j], lines[k])) {
          isTriangleFormed = true;
          triangleArray = [lines[i], lines[j], lines[k]];
          break;
        }
      }
      if (isTriangleFormed) {
        break;
      }
    }
    if (isTriangleFormed) {
      break;
    }
  }

  if(isTriangleFormed) {
    return triangleArray;
  } else {
    return false;
  }
  //그렇다면 그 직선의 색을 바꾼다
};

export default equilateralTriangle;
