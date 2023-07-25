import nerdamer from "nerdamer/all.js";

const newPoint = () =>{
  const x1 = 2;
  const y1 = 3;
  const r1 = 4;
  const x2 = 5;
  const y2 = 6;
  const r2 = 7;

  const eq = `(x-${x1})^2+(y-${y1})^2-${r1}^2-(x-${x2})^2-(y-${y2})^2+${r2}^2`
  const circleEq = `(x-${x1})^2+(y-${y1})^2-${r1}^2`
  
  //x좌표 구하기
  const lineEqY = nerdamer.solve(eq, 'y');
  const solXEq = nerdamer(circleEq, {y: lineEqY} ).text();
  const solXEqSlice = solXEq.slice(1, -1);
  const solX = nerdamer.solve(solXEqSlice, 'x');
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

console.log(newPoint())


export default newPoint;