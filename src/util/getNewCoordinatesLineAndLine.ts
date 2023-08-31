const getNewCoordinatesLineAndLine = (
  startX1: number,
  startY1: number,
  endX1: number,
  endY1: number,
  startX2: number,
  startY2: number,
  endX2: number,
  endY2: number
) => {
  let x = 0;
  let y = 0;

  if (endX1 - startX1 === 0) {
    x = startX1;
  } else if (endX2 - startX2 === 0) {
    x = startX2;
  }

  if (endY1 - startY1 === 0) {
    y = startY1;
  } else if (endY2 - startY2 === 0) {
    y = startY2;
  }

  if (x !== 0 && y !== 0) {
    return { x, y };
  } else {
    const newGradient = (endY1 - startY1) / (endX1 - startX1); //a
    const newYIntercept = startY1 - newGradient * startX1; //b
    const existingGradient = (endY2 - startY2) / (endX2 - startX2); //c
    const existingYIntercept = startY2 - existingGradient * startX2; //d

    if (newGradient !== existingGradient) {
      const newX =
        (existingYIntercept - newYIntercept) / (newGradient - existingGradient);
      const newY =
        (newGradient * existingYIntercept - newYIntercept * existingGradient) /
        (newGradient - existingGradient);
      const isInRangeX =
        newX >= Math.min(startX1, endX1) && newX <= Math.max(startX1, endX1);
      const isInRangeY =
        newY >= Math.min(startY1, endY1) && newY <= Math.max(startY1, endY1);

      if (isInRangeX && isInRangeY) {
        return { x: newX, y: newY };
      } else {
        return false;
      }
    }
  }
};

export default getNewCoordinatesLineAndLine;
