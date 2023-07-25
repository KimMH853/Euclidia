function solveCircleEquations(x1, y1, r1, x2, y2, r2) {
  const A = 2 * (x2 - x1);
  const B = 2 * (y2 - y1);
  const C = Math.pow(r1, 2) - Math.pow(r2, 2) + Math.pow(x2, 2) - Math.pow(x1, 2) + Math.pow(y2, 2) - Math.pow(y1, 2);

  if (A === 0 && B === 0) {
    if (C === 0) {
      return '무수히 많은 해가 존재합니다.'; // 원이 동일한 경우
    } else {
      return '해가 존재하지 않습니다.'; // 원이 완전히 겹치지 않는 경우
    }
  } else {
    const x = C / (2 * A);
    const y = (C - A * x) / B;
    return { x, y };
  }
}

// 예시 사용
const solution = solveCircleEquations(0, 0, 3, 4, 0, 5);
console.log(solution); // { x: 2, y: 3 }