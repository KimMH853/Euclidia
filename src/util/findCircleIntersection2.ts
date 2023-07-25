import * as math from "mathjs";
import distanceBetweenPoints from "./distanceBetweenPoints";

const findCircleIntersection2 = (x1:number, y1:number, x2:number, y2:number) => {
  const radius = distanceBetweenPoints(x1, y1, x2, y2)
  const circleEquationSystem = math.parse(`x^2 -${x1}x + ${x1}^2 + y^2 -${y1}y + ${y1}^2 - ${radius}^2-(x^2 -${x2}x + ${x2}^2 + y^2 -${y2}y + ${y2}^2 - ${radius}^2)`);
  const lineEquation = math.simplify(circleEquationSystem);
  const ret = math.rationalize(lineEquation,{},true).expression;
  
  // const equationWithoutSpaces = ret.replace(/\s/g, '');

  // // 변수 a, b 초기화
  // let a = 0;
  // let b = 0;

  // // *x 앞에 있는 숫자와 부호 추출
  // const regexX = /([-+]?\d+)\*x/;
  // const matchX = equationWithoutSpaces.match(regexX);
  // if (matchX) {
  //   a = Number(matchX[1]);
  // }

  // // *y 앞에 있는 숫자와 부호 추출
  // const regexY = /([-+]?\d+)\*y/;
  // const matchY = equationWithoutSpaces.match(regexY);
  // if (matchY) {
  //   b = Number(matchY[1]);
  // }
  return ret
  
};
const result = findCircleIntersection2(1,3,5,4);
console.log(result)
export default findCircleIntersection2;
