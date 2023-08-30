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

const equalLengthLine = (coordinates:Coordinate[], shapes:Shape[]) =>{
  //좌표a가 포함된 직선을 찾는다
  const coordA = coordinates.find((coord)=>coord.tag === "A")
  const coordB = coordinates.find((coord)=>coord.tag === "B")
  const coordC = coordinates.find((coord)=>coord.tag === "C")

  if (coordA && coordB && coordC) {
    const lineLength = getDistanceBetweenCoordinates(coordB.x, coordB.y, coordC.x, coordC.y)
    const Alines = shapes.filter((line)=>line.type==="line" &&
      (line.startX ===coordA.x &&  line.startY===coordA.y ||
      line.endX ===coordA.x &&  line.endY===coordA.y)
    )
    
    //직선의 방정식을 구한다
    const lineEquation:{gradient: number, yIntercept: number}[] = [];

    Alines.forEach((line)=>{
      const gradient = (line.endY-line.startY)/(line.endX-line.startX); //a
      const yIntercept = line.startY - gradient*line.startX; //b
      lineEquation.push({gradient, yIntercept});
    })
    
    // 직선의 방정식에 포함 된 좌표를 찾는다
    const coordinateOnLine = coordinates.filter((coord) => lineEquation.some((line)=>makeComparableValue(line.gradient*coord.x +line.yIntercept) === makeComparableValue(coord.y) ));

    const correctCoordinates = coordinateOnLine.filter((coord)=>{
      const distanceFromA = getDistanceBetweenCoordinates(coord.x,coord.y, coordA.x, coordA.y);
      return makeComparableValue(distanceFromA) === makeComparableValue(lineLength)
    })

    if(correctCoordinates.length > 0) {
      const correctLines:Shape[] = [];
      correctCoordinates.forEach((coord)=> {
        const newLine = {
          type: "line",
          startX: coordA.x,
          startY: coordA.y,
          endX: coord.x,
          endY: coord.y,
        }
        correctLines.push(newLine)
      })
      return correctLines;
    } else {
      return false;
    }
    

  }

 
  
    
  

  

  

  //좌표간 거리를 구하여 bc와 같은 거리를 구하고

  // shape 타입으로 리턴
  
} 

export default equalLengthLine;