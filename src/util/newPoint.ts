import nerdamer from "nerdamer/all.js";

const newPoint = (x1: number, y1: number, r1: number,  x2: number, y2: number, r2: number): { x: number; y: number; }[] =>{

  if(y1 === y2) {
    
    let newXPoint;
    if(x1>x2){
      newXPoint = x2 + (x1-x2)/2;
    } else {
      newXPoint = x1 + (x2-x1)/2;
    }

    const newYPoint1 = y1 - r1 * Math.sqrt(3)/2;
    const newYPoint2 = y1 + r1 * Math.sqrt(3)/2;

    return [{x: newXPoint, y: newYPoint1}, {x: newXPoint, y: newYPoint2}];
    
  } else if(x1 === x2) {
    
    let newYPoint;
    if(y1>y2){
      newYPoint = y2 + (y1-y2)/2;
    } else {
      newYPoint = y1 + (y2-y1)/2;
    }

    const newXPoint1 = x1 - r1 * Math.sqrt(3)/2;
    const newXPoint2 = x1 + r1 * Math.sqrt(3)/2;

    return [{x: newXPoint1, y: newYPoint}, {x: newXPoint2, y: newYPoint}];

  } else {

    const eq = `(x-${x1})^2+(y-${y1})^2-${r1}^2-(x-${x2})^2-(y-${y2})^2+${r2}^2`
    const circleEq = `(x-${x1})^2+(y-${y1})^2-${r1}^2`

    //x좌표 구하기
    const lineEqY = nerdamer.solve(eq, 'y');
    const solXEq = nerdamer(circleEq, {y: lineEqY}).text();
    const solXEqSlice = solXEq.slice(1, -1);
    const solX = nerdamer.solve(solXEqSlice, 'x').evaluate();
    const solXText = solX.text();
    const xArray = solXText.slice(1, -1).split(',').map(Number);

    //y좌표 구하기
    const lineEqX = nerdamer.solve(eq, 'x');
    const solYEq = nerdamer(circleEq, {x: lineEqX} ).text();
    const solYEqSlice = solYEq.slice(1, -1);
    const solY = nerdamer.solve(solYEqSlice, 'y');
    const solYText = solY.text();
    const yArray = solYText.slice(1, -1).split(',').map(Number);
    

    return [{x: xArray[0], y: yArray[0]}, {x: xArray[1], y: yArray[1]}];
  }
}

export default newPoint;