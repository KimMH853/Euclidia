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
  

};

export default checkAnswerData;
