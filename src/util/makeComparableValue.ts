const makeComparableValue = (number: number) => {
  if(!number) return;
  number = parseFloat(number.toFixed(11));
  number = Math.floor(number * 10000) / 10000;

  return number;
};

export default makeComparableValue;
