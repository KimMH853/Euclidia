const getNewCoordinatesLineAndLine = (startX1: number, startY1: number, endX1: number, endY1: number, startX2: number, startY2: number, endX2: number, endY2: number) =>{
  //
  //console.log(startX1, startY1, endX1, endY1, startX2, startY2, endX2, endY2 )
  let x = 0;
  let y = 0;
  
  if(endX1-startX1===0) {
    //x=200, 
    x = startX1;
  } else if(endX2-startX2===0) {
    x = startX2;
  }
  
  if(endY1-startY1===0) {
    y = startY1;
  } else if(endY2-startY2===0) {
    y = startY2;
  }

  if(x !==0 && y !==0) {
    //console.log("직선과 직선")
    //console.log({x, y})
    return {x, y}
  } else {
    const newGradient = (endY1-startY1)/(endX1-startX1); //a
    const newYIntercept = startY1 - newGradient*startX1; //b
    //console.log(newGradient)
    //console.log(newYIntercept)
    const existingGradient = (endY2-startY2)/(endX2-startX2);//c
    const existingYIntercept = startY2 - existingGradient*startX2; //d
    //console.log(existingGradient)
    //console.log(existingYIntercept)
    if(newGradient !== existingGradient) {
      //a - c!=0, x = (d - b)/(a - c), y = (a d - b c)/(a - c)
      const newX = (existingYIntercept - newYIntercept)/(newGradient - existingGradient);
      const newY = (newGradient * existingYIntercept - newYIntercept * existingGradient)/(newGradient - existingGradient);
      //const newY = newGradient*(existingYIntercept - newYIntercept)/(newGradient - existingGradient) + newYIntercept
      
      //console.log("새좌표")
      //console.log(newX, newY)

      
      const isInRangeX = (newX >= Math.min(startX1, endX1) && newX <= Math.max(startX1, endX1));
      const isInRangeY = (newY >= Math.min(startY1, endY1) && newY <= Math.max(startY1, endY1));

      if (isInRangeX && isInRangeY) {
          //console.log("직선 좌표");
          //console.log({ x: newX, y: newY });

          return { x: newX, y: newY };
      } else {
          console.log("교점은 계산되었으나 범위에 속하지 않음");
          return false;
      }
          
    
  }
  }
  
  

  
  
}

export default getNewCoordinatesLineAndLine;