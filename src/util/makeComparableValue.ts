const makeComparableValue = (number: number) => {
  if(!number) return;
  number = parseFloat(number.toFixed(9));
  number = Math.floor(number * 10000) / 10000;

  return number;
};

export default makeComparableValue;
