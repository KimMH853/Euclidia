import bisectLine from "../checkAnswer/bisectLine";
import checkVerticalLine from "../checkAnswer/checkverticalLine";
import equalAngle from "../checkAnswer/equalAngle";
import equalLengthLine from "../checkAnswer/equalLengthLine";
import equilateralTriangle from "../checkAnswer/equilateralTriangle";

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

type ProblemCheckFunction = (coordinates: Coordinate[], shapes: Shape[]) => false | Shape[];

const checkAnswerData: { [key: number]:ProblemCheckFunction } = {
  0: equilateralTriangle,
  1: equalLengthLine,
  2: equalAngle,
  3: bisectLine,
  4: checkVerticalLine
  

};

export default checkAnswerData;
