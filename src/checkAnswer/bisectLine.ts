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

const bisectLine = (coordinates:Coordinate[], shapes:Shape[]) => {

  const coordA = coordinates.find(coord=>coord.tag === "A");
  const coordB = coordinates.find(coord=>coord.tag === "B");

  if(coordA && coordB) {
    const referenceX = makeComparableValue((coordA.x + coordB.x)/2)  
    const referenceY = makeComparableValue(coordA.y)

    const correctCoord = coordinates.find(coord=>
      makeComparableValue(coord.x) === referenceX &&
      makeComparableValue(coord.y) === referenceY
    )

    if(correctCoord) {
      return [{type: "line",
        startX: coordA.x,
        startY: coordA.y,
        endX: correctCoord.x,
        endY: correctCoord.y,
      },
      {
        type: "line",
        startX: coordB.x,
        startY: coordB.y,
        endX: correctCoord.x,
        endY: correctCoord.y,
        }]
    } else {
      return false;
    }
  } else {
    return false;
  }

  
}

export default bisectLine;