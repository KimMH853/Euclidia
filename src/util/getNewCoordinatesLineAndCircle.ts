import nerdamer from "nerdamer/all.js";

const getNewCoordinatesLineAndCircle =(lineStartX: number, lineStartY: number, lineEndX: number, lineEndY: number, circleX: number, circleY: number, radius: number) =>{
//
  //console.log(lineStartX, lineStartY, lineEndX, lineEndY)
  const gradient = (lineEndY-lineStartY)/(lineEndX-lineStartX);
  const yIntercept = lineStartY - gradient*lineStartX; 
  const lineEqY = `x * ${gradient} + ${yIntercept}`
  
  //console.log(lineEqY)
  const circleEq = `(x-${circleX})^2+(y-${circleY})^2-${radius}^2`
  //console.log(circleEq)
  
  const solXEq = nerdamer(circleEq, {y: lineEqY}).text();
  //console.log(solXEq)
  const solX = nerdamer.solve(solXEq, 'x');
  const solXText = solX.text();
  //console.log(solXText)
  const xArray = solXText.slice(1, -1).split(',').map(Number);
  //console.log(xArray)

  const xCoordinates: number[] = xArray.filter((x: number) => {
    if(lineStartX<lineEndX) {
      return x>lineStartX && x<lineEndX;
    } else {
      return x<lineStartX && x>lineEndX;
    }
    } )

    //console.log(xCoordinates)

  const yCoordinates:number[] = [];

  if(xCoordinates) {
    
    //console.log(xCoordinates)
    
    xCoordinates.forEach((x:number) =>{
      const y = x*gradient + yIntercept;
      yCoordinates.push(y)
    })
  }
  //console.log(xCoordinates)

  //console.log(yCoordinates)
  if (xCoordinates && xCoordinates.length === 1) {  
    return [{ x: xCoordinates[0], y: yCoordinates[0] }];
  } else if(xCoordinates && xCoordinates.length === 2) {

    return [{ x: xCoordinates[0], y: yCoordinates[0] }, { x: xCoordinates[1], y: yCoordinates[1] }];
  } else {
    return false;
  }
  


}

export default getNewCoordinatesLineAndCircle;