// Function to subtract quadratic equations
function subtractQuadraticEquations(eq1, eq2) {
  // Extract coefficients of eq1
  const a1 = eq1[0];
  const b1 = eq1[1];
  const c1 = eq1[2];

  // Extract coefficients of eq2
  const a2 = eq2[0];
  const b2 = eq2[1];
  const c2 = eq2[2];

  // Subtract corresponding coefficients
  const newA = a1 - a2;
  const newB = b1 - b2;
  const newC = c1 - c2;

  // Display the resulting equation
  const result = `${newA}x^2 ${newB >= 0 ? '+' : '-'} ${Math.abs(newB)}x ${newC >= 0 ? '+' : '-'} ${Math.abs(newC)}`;
  return result;
}

// Example usage
const equation1 = [2, 5, 3]; // 2x^2 + 5x + 3
const equation2 = [1, 3, 2]; // 1x^2 + 3x + 2

const result = subtractQuadraticEquations(equation1, equation2);
console.log(result); // Output: "1x^2 + 2x + 1"