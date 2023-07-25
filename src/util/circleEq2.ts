const circleEq = () =>{
  const x1 = 2;
  const y1 = 3;
  const r1 = 4;
  const x2 = 5;
  const y2 = 6;
  const r2 = 7;

  let x3 = 0;
  let y3 = 0;
  let x4 = 0;
  let y4 = 0;
  
  let a1 =0;
  let b1 =0;
  let c1 =0;
  let a2 =0;
  let b2 =0;
  let c2 =0;
  let a3 = 0;
  let b3 = 0;
  let c3 = 0;
  let a4 = 0;
  let a = 0;
  let b = 0;
  let c = 0;
  

  const eq1 = 'x**2 + a1*x + y**2 + b1*y  + c1'
  a1 = -2*x1;
  b1 = -2*y1;
  c1 = x1**2 + y1**2 - r1**2;

  const eq2 = 'x**2 + a2*x + y**2 + b2*y  + c2'
  a2 = -2*x2;
  b2 = -2*y2;
  c2 = x2**2 + y2**2 - r2**2;

  const eq3= 'ax + by + c'
  a3 = a1 - a2;
  b3 = b1 - b2;
  c3 = c1 - c2;

  const eq4= 'y= -ax/b -c/b'
  a3 = -(a3/b3);
  b3 = 1;
  c3 = -(c3/b3);

  const eq5 = 'x**2 + a1*x + a3x**2 +2a3c3x +c3**2 + b1*(a3x +c3) + c1'
  a = 1 + a3;
  b = a1 + (2 * a3 *c3) + (b1 * a3);
  c = c3**2 + (b1 + c3) + c1;
  

  x3 = (-b + Math.sqrt(b**2 - 4 * a * c))/2 * a;
  x4 = (-b - Math.sqrt(b**2 - 4 * a * c))/2 * a;

  return [x3, x4];
}



