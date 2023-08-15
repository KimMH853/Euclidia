import getNewCoordinates from "./getNewCoordinates";

const arr = [{x: 2, y: 3, r: 4}, {x: 5, y: 6, r: 7}];

const circle = {x: 3, y: 2, r: 4}



arr.forEach((item, index) =>{
  console.log(index)
  
  console.log(item.x, item.y, item.r, circle.x, circle.y, circle.r)

  const result = getNewCoordinates(item.x, item.y, item.r, circle.x, circle.y, circle.r)
  console.log(result)

})