import math, {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  log,
  pi,
  pow,
  round,
  sqrt,
} from "mathjs";

const findIntersection = () => {
  const A = math.matrix([
    [2, -3],
    [5, -6],
  ]);

  const B = math.matrix([-5, -50]);

  const { L, U, P } = math.lup(A); // LU 분해

  const Pb = math.multiply(P, B); // 상수 벡터 재정렬

  const y = math.lsolve(L, Pb); // 하삼각행렬을 이용하여 y 계산

  const x = math.lsolve(U, y); // 상삼각행렬을 이용하여 x 계산

  const xValue = x.get([0]);

  const yValue = x.get([1]);
  // const x = math.symbol('x');
  // const y = math.symbol('y');

  // const eq1 = math.parse('(x - 2)^2 + (y - 3)^2 - 4^2');
  // const eq2 = math.parse('(x - 5)^2 + (y - 6)^2 - 7^2');

  // const equations = [
  //   eq1,
  //   eq2
  // ];

  // const solution = math.lsolve(equations, [x, y]);
  // const xValue = solution[0].toNumber();
  // const yValue = solution[1].toNumber();

  // const xValue = atan2(3, -3) / pi
  // const yValue = log(10000, 10)
  return {
    x: xValue,
    y: yValue,
  };
};

const intersection = findIntersection();
console.log(
  `교차점 1: (x ≈ ${intersection.x.toFixed(2)}, y ≈ ${intersection.y.toFixed(
    2
  )})`
);

export default findIntersection;
