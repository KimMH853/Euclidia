const makeComparableValue = (number: number) => {
  number = parseFloat(number.toFixed(11));
  number = Math.floor(number * 1000000000) / 1000000000;

  return number;
};

export default makeComparableValue;
