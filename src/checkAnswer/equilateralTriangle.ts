import distanceBetweenPoints from "../util/distanceBetweenPoints";
import makeComparableValue from "../util/makeComparableValue";

const equilateralTriangle = (clickedPoints:{ x: number; y: number;}[]) => {
  let distance1 =  distanceBetweenPoints(clickedPoints[0].x, clickedPoints[0].y, clickedPoints[1].x, clickedPoints[1].y);
  let distance2 =  distanceBetweenPoints(clickedPoints[1].x, clickedPoints[1].y, clickedPoints[2].x, clickedPoints[2].y);
  let distance3 =  distanceBetweenPoints(clickedPoints[2].x, clickedPoints[2].y, clickedPoints[0].x, clickedPoints[0].y);

  distance1 = makeComparableValue(distance1);
  distance2 = makeComparableValue(distance2);
  distance3 = makeComparableValue(distance3);
  
  if( distance1===distance2 && distance2===distance3) {
    return true;
  } else {
    return false;
  }
};

export default equilateralTriangle;