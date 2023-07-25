import distanceBetweenPoints from "./distanceBetweenPoints";

const findCircleIntersection = (circle1, circle2) => {
  const x1 = circle1.x;
  const y1 = circle1.y;
  const r1 = circle1.radius;

  const x2 = circle2.x;
  const y2 = circle2.y;
  const r2 = circle2.radius;

  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  if (distance > r1 + r2) {
    return [];
  }

  if (distance === 0 && r1 === r2) {
    return [];
  }

  if (distance === r1 + r2) {
    const x = x1 + (x2 - x1) * r1 / (r1 + r2);
    const y = y1 + (y2 - y1) * r1 / (r1 + r2);
    return [{ x, y }];
  }

  const a = (Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(distance, 2)) / (2 * distance);
  const h = Math.sqrt(Math.pow(r1, 2) - Math.pow(a, 2));
  const x3 = x1 + (x2 - x1) * a / distance;
  const y3 = y1 + (y2 - y1) * a / distance;
  const x4 = x3 + (y2 - y1) * h / distance;
  const y4 = y3 - (x2 - x1) * h / distance;

  return [
    { x: x3, y: y3 },
    { x: x4, y: y4 }
  ];
}

// 예시
const circle1 = { x: 150, y: 180, radius: distanceBetweenPoints(150,180,250,240) };
const circle2 = { x: 250, y: 240, radius: distanceBetweenPoints(150,180,250,240) };
const intersectionPoints = findCircleIntersection(circle1, circle2);
console.log(intersectionPoints);

export default findCircleIntersection;