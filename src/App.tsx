import React, { useCallback, useEffect, useRef, useState } from "react";
import newPoint from "./util/newPoint";
import distanceBetweenPoints from "./util/distanceBetweenPoints";
import equilateralTriangle from "./checkAnswer/equilateralTriangle";
import makeComparableValue from "./util/makeComparableValue";

type Shape = {
  type: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  selected: boolean;
};

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<
    { tag: string; x: number; y: number; isClicked: boolean }[]
  >([
    { tag: "A", x: 150, y: 200, isClicked: false },
    { tag: "B", x: 250, y: 200, isClicked: false },
  ]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [clickedPoints, setClickedPoints] = useState<
    { x: number; y: number }[]
  >([]);
  const [shapeType, setShapeType] = useState("");
  const [isLineSelected, setIsLineSelected] = useState<boolean>(false);
  const [isCircleSelected, setIsCircleSelected] = useState<boolean>(false);
  const [prevCircleShapesCount, setPrevCircleShapesCount] = useState(1);
  const [isAnswer, setIsAnswer] = useState(false);
  const [isAnswerClicked, setIsAnswerClicked] = useState(false);

  //점과 도형 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = point.isClicked ? "blue" : "black";
      ctx.fill();

      ctx.font = "12px sans-serif";
      ctx.fillText(point.tag, point.x - 4, point.y - 6);
    });

    shapes.forEach((shape) => {
      if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.strokeStyle = shape.selected ? "red" : "black";
        ctx.stroke();
      } else if (shape.type === "circle") {
        const radius = Math.sqrt(
          (shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2
        );
        ctx.beginPath();
        ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = shape.selected ? "blue" : "black";
        ctx.stroke();
      }
    });
    
    
  }, [points, shapes]);

  const addPoint = ()=>{
    const circleShapes = shapes.filter((shape) => shape.type === "circle");
    if (circleShapes.length > prevCircleShapesCount) {
      const {
        startX: lastStartX,
        startY: lastStartY,
        endX: lastEndX,
        endY: lastEndY,
      } = circleShapes[circleShapes.length - 1];

      const lastR1 = distanceBetweenPoints(
        lastStartX,
        lastStartY,
        lastEndX,
        lastEndY
      );

      let results: { x: number; y: number }[] = [];
      results = circleShapes
        .slice(0, circleShapes.length - 1)
        .flatMap(({ startX, startY, endX, endY }) => {
          const r2 = distanceBetweenPoints(startX, startY, endX, endY);
          console.log(startX);
          return newPoint(lastStartX, lastStartY, lastR1, startX, startY, r2);
        });

      const newPoints = results.filter(
        ({ x, y }) =>
          !points.some(() => {
            const comparableX = makeComparableValue(x);
            const comparableY = makeComparableValue(y);
            return points.some(
              (point) =>
                makeComparableValue(point.x) === comparableX &&
                makeComparableValue(point.y) === comparableY
            );
          })
      );

      console.log(newPoints);

      setPoints((prevPoints) => [
        ...prevPoints,
        ...newPoints.map((point, index) => ({
          tag: String.fromCharCode(prevPoints.length + index + 65),
          ...point,
          isClicked: false,
        })),
      ]);

      setPrevCircleShapesCount(circleShapes.length);
    }
    
  }

  const addShape = (selectedType: string)=>{
      const [startPoint, endPoint] = clickedPoints;

      const newShape: Shape = {
        type: selectedType,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        selected: false,
      };

      setShapes((prevShapes) => [...prevShapes, newShape]);
      setClickedPoints([]);
      points.forEach((point) => {
        point.isClicked = false;
      });
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const updatedPoints = points.map((point) => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      const isClicked = distance <= 10;

      //clickedPoints 관리
      if (isClicked) {
        const duplicationPoints = clickedPoints.filter(
          (clickedPoint) =>
            clickedPoint.x === point.x && clickedPoint.y === point.y
        );
  
        if (duplicationPoints.length === 0) {
          setClickedPoints((prevClicked) => [
            ...prevClicked,
            { x: point.x, y: point.y },
          ]);
        } else {
          setClickedPoints((prevClicked) =>
            prevClicked.filter(
              (clickedPoint) =>
                clickedPoint.x !== point.x || clickedPoint.y !== point.y
            )
          );
        }
      }
     
      return {
        ...point,
        isClicked: isClicked ? !point.isClicked : point.isClicked,
      };
    });
  
    setPoints(updatedPoints);

    
  };

  const handleTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedType = event.currentTarget.name;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if(clickedPoints.length ===2) {
      addShape(selectedType);
    }
    addPoint();
  };

  const handleAnswerButtonClick = () => {
    if (isAnswerClicked && clickedPoints.length === 3) {
      setIsAnswer(equilateralTriangle(clickedPoints));
      setClickedPoints([]);
    }

    setIsAnswerClicked((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        On a given finite right line (AB) to construct an equilateral triangle.
      </div>

      <div className="m-2">
        <button
          className={`mr-2 px-4 py-2 ${
            isLineSelected
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="line"
          onClick={handleTypeClick}
        >
          직선
        </button>

        <button
          className={`px-4 py-2 ${
            isCircleSelected
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="circle"
          onClick={handleTypeClick}
        >
          원
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-black"
        onClick={handleCanvasClick}
      />

      <div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          name="circle"
          onClick={handleAnswerButtonClick}
        >
          {isAnswerClicked ? "확인" : "정답"}
        </button>
        {isAnswerClicked && <div>삼각형의 꼭지점을 클릭하세요</div>}
        {isAnswer && <div>정답입니다</div>}
        <div> points {JSON.stringify(points)}</div>
        <div> clickedPoints {JSON.stringify(clickedPoints)}</div>
        <div> shapes {JSON.stringify(shapes)}</div>
        <div> shapeType {JSON.stringify(shapeType)}</div>
      </div>
    </div>
  );
};

export default App;
