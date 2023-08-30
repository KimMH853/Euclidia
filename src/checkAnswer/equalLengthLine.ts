import getDistanceBetweenCoordinates from "../util/getDistanceBetweenCoordinates";

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

const equalLengthLine = (coordinates:Coordinate[], shapes:Shape[]) =>{
  //좌표a가 포함된 직선을 찾는다
  const coordA = coordinates.find((coord)=>coord.tag = "A")
  const coordB = coordinates.find((coord)=>coord.tag = "B")
  const coordC = coordinates.find((coord)=>coord.tag = "C")

  if (coordA && coordB && coordC) {
    const lineLength = getDistanceBetweenCoordinates(coordB.x, coordB.y, coordC.x, coordC.y)

    const Alines = shapes.filter((line)=>line.type==="line" &&
      (line.startX ===coordA.x &&  line.startY===coordA.y ||
      line.endX ===coordA.x &&  line.endY===coordA.y)
    )
    let lineEquation = [];

    Alines.forEach((line)=>{
      if(line.startX-line.endX === 0) {
        const x = line.startX;
      } else {
        
      }
    })
    const newGradient = (endY1-startY1)/(endX1-startX1); //a
    const newYIntercept = startY1 - newGradient*startX1; //b


  }

 
  
    
  

  //직선의 방정식을 구한다

  // 직선의 방정식에 포함 된 좌표를 찾는다

  //좌표간 거리를 구하여 bc와 같은 거리를 구하고

  // shape 타입으로 리턴
  
} 

export default equalLengthLine;