import getDistanceBetweenCoordinates from "../util/getDistanceBetweenCoordinates";
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

const equalAngle = (coordinates: Coordinate[], shapes: Shape[]) => {
  //각도 찾기 한 좌표를 포함하는 직선이 두개 면 각도를 구한다
  const lines = shapes.filter((shape) => shape.type === "line");
  const result: any[] = [];
  let cases = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (
        lines[i].startX === lines[j].startX &&
        lines[i].startY === lines[j].startY
      ) {
        cases = 1;
      }
      if (
        lines[i].startX === lines[j].endX &&
        lines[i].startY === lines[j].endY
      ) {
        cases = 2;
      }
      if (
        lines[i].endX === lines[j].startX &&
        lines[i].endY === lines[j].startY
      ) {
        cases = 3;
      }
      if (
        lines[i].endX === lines[j].endX &&
        lines[i].endY === lines[j].startY
      ) {
        cases = 4;
      }
      //console.log(cases)
      if (cases > 0) {
        result.push({ 0: lines[i], 1: lines[j], 2: cases });
      }
      cases = 0;
    }
  }

  //각도 구하기
  if (result.length > 0) {
    result.forEach((angle, index) => {
      let AB = 0;
      let AC = 0;
      let BC = 0;

      if (angle[2] === 1) {
        AB = getDistanceBetweenCoordinates(
          angle[0].startX,
          angle[0].startY,
          angle[0].endX,
          angle[0].endY
        );
        AC = getDistanceBetweenCoordinates(
          angle[1].startX,
          angle[1].startY,
          angle[1].endX,
          angle[1].endY
        );
        BC = getDistanceBetweenCoordinates(
          angle[0].endX,
          angle[0].endY,
          angle[1].endX,
          angle[1].endY
        );
      }

      if (angle[2] === 2) {
        AB = getDistanceBetweenCoordinates(
          angle[0].startX,
          angle[0].startY,
          angle[0].endX,
          angle[0].endY
        );
        AC = getDistanceBetweenCoordinates(
          angle[1].endX,
          angle[1].endY,
          angle[1].startX,
          angle[1].startY
        );
        BC = getDistanceBetweenCoordinates(
          angle[0].endX,
          angle[0].endY,
          angle[1].startX,
          angle[1].startY
        );
      }

      if (angle[2] === 3) {
        AB = getDistanceBetweenCoordinates(
          angle[0].endX,
          angle[0].endY,
          angle[0].startX,
          angle[0].startY
        );
        AC = getDistanceBetweenCoordinates(
          angle[1].startX,
          angle[1].startY,
          angle[1].endX,
          angle[1].endY
        );
        BC = getDistanceBetweenCoordinates(
          angle[0].startX,
          angle[0].startY,
          angle[1].endX,
          angle[1].endY
        );
      }

      if (angle[2] === 4) {
        AB = getDistanceBetweenCoordinates(
          angle[0].endX,
          angle[0].endY,
          angle[0].startX,
          angle[0].startY
        );
        AC = getDistanceBetweenCoordinates(
          angle[1].endX,
          angle[1].endY,
          angle[1].startX,
          angle[1].startY
        );
        BC = getDistanceBetweenCoordinates(
          angle[0].startX,
          angle[0].startY,
          angle[1].startX,
          angle[1].startY
        );
      }

      const cosAngle = (AB * AB + AC * AC - BC * BC) / (2 * AB * AC);
      const angleRad = Math.acos(cosAngle);
      const angleDeg = (angleRad * 180) / Math.PI;

      if (angleDeg > 0) {
        result[index].angleDegree = angleDeg;
      }
    });

    const referenceAngle = makeComparableValue(result[0].angleDegree / 2);
    const correctAngles = result.filter(
      (angle) => makeComparableValue(angle.angleDegree) === referenceAngle
    );

    if (correctAngles.length === 2) {
      return [
        correctAngles[0]["0"],
        correctAngles[0]["1"],
        correctAngles[1]["0"],
      ];
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default equalAngle;
