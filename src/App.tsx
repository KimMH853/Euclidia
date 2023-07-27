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
    initDraw();
  }, []);

  const initDraw = () => {
    // 초기 문제 그려주기(문제와 관련된 점 그려주기)
  }

  const addPosForDrawing = () => {
    //
  }

  const drawLine = ()=> {
    //
  }

  const drawCircle = () => {
    //
  }

  const deleteShape = () => {
    //
  }

  const handleCanvasClick = () => {
    // 선택된 툴이 없을 시 return

    // 클릭 된 지점의 좌표의 위치를 점 배열과 비교 하고 거리가 10 이내면, 점을 그리기위한배열에 좌표 추가

    // 조건1. 선택된 툴이 직선일 때

    // 추가된 좌표가 2개라면, 2개 좌표간의 거리를 구해서 직선 그려주기
    
    // 조건2. 선택된 툴이 원일 때

    // 추가된 좌표가 2개라면, 2개 좌표간의 거리를 구해서 원을 그려주기

    // 조건3. 선택된 툴이 지우개일 때

    // 직선이나 원이 그려진 좌표를 클릭시 해당 도형을 지움
  }

  const handleClickLineButton = () => {
    // 직선버튼 클릭 -> 선택된 툴 직선으로 변경
  }

  const handleClickCircleButton = () => {
    // 원버튼 클릭 -> 선택된 툴 원으로 변경
  }

  const handleClickEraseButton = () => {
    // 지우개버튼 클릭 -> 선택된 툴을 지우개로 변경
  }

  const handleAnswerButtonClick = () => {
    // 
  }

  // const addPoint = ()=>{
  //   const circleShapes = shapes.filter((shape) => shape.type === "circle");
  //   if (circleShapes.length > prevCircleShapesCount) {
  //     const {
  //       startX: lastStartX,
  //       startY: lastStartY,
  //       endX: lastEndX,
  //       endY: lastEndY,
  //     } = circleShapes[circleShapes.length - 1];

  //     const lastR1 = distanceBetweenPoints(
  //       lastStartX,
  //       lastStartY,
  //       lastEndX,
  //       lastEndY
  //     );

  //     let results: { x: number; y: number }[] = [];
  //     results = circleShapes
  //       .slice(0, circleShapes.length - 1)
  //       .flatMap(({ startX, startY, endX, endY }) => {
  //         const r2 = distanceBetweenPoints(startX, startY, endX, endY);
  //         console.log(startX);
  //         return newPoint(lastStartX, lastStartY, lastR1, startX, startY, r2);
  //       });

  //     const newPoints = results.filter(
  //       ({ x, y }) =>
  //         !points.some(() => {
  //           const comparableX = makeComparableValue(x);
  //           const comparableY = makeComparableValue(y);
  //           return points.some(
  //             (point) =>
  //               makeComparableValue(point.x) === comparableX &&
  //               makeComparableValue(point.y) === comparableY
  //           );
  //         })
  //     );

  //     console.log(newPoints);

  //     setPoints((prevPoints) => [
  //       ...prevPoints,
  //       ...newPoints.map((point, index) => ({
  //         tag: String.fromCharCode(prevPoints.length + index + 65),
  //         ...point,
  //         isClicked: false,
  //       })),
  //     ]);

  //     setPrevCircleShapesCount(circleShapes.length);
  //   }
    
  // }

  // const addShape = (selectedType: string)=>{
  //     const [startPoint, endPoint] = clickedPoints;

  //     const newShape: Shape = {
  //       type: selectedType,
  //       startX: startPoint.x,
  //       startY: startPoint.y,
  //       endX: endPoint.x,
  //       endY: endPoint.y,
  //       selected: false,
  //     };

  //     setShapes((prevShapes) => [...prevShapes, newShape]);
  //     setClickedPoints([]);
  //     points.forEach((point) => {
  //       point.isClicked = false;
  //     });
  // }

  // const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  
  //   const rect = canvas.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;
  
  //   const updatedPoints = points.map((point) => {
  //     const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
  //     const isClicked = distance <= 10;

  //     //clickedPoints 관리
  //     if (isClicked) {
  //       const duplicationPoints = clickedPoints.filter(
  //         (clickedPoint) =>
  //           clickedPoint.x === point.x && clickedPoint.y === point.y
  //       );
  
  //       if (duplicationPoints.length === 0) {
  //         setClickedPoints((prevClicked) => [
  //           ...prevClicked,
  //           { x: point.x, y: point.y },
  //         ]);
  //       } else {
  //         setClickedPoints((prevClicked) =>
  //           prevClicked.filter(
  //             (clickedPoint) =>
  //               clickedPoint.x !== point.x || clickedPoint.y !== point.y
  //           )
  //         );
  //       }
  //     }
     
  //     return {
  //       ...point,
  //       isClicked: isClicked ? !point.isClicked : point.isClicked,
  //     };
  //   });
  
  //   setPoints(updatedPoints);

    
  // };

  // const handleTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   const selectedType = event.currentTarget.name;

  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   if(clickedPoints.length ===2) {
  //     addShape(selectedType);
  //   }
  //   addPoint();
  // };

  // const handleAnswerButtonClick = () => {
  //   if (isAnswerClicked && clickedPoints.length === 3) {
  //     setIsAnswer(equilateralTriangle(clickedPoints));
  //     setClickedPoints([]);
  //   }

  //   setIsAnswerClicked((prev) => !prev);
  // };

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
          onClick={handleClickLineButton}
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
          onClick={handleClickCircleButton}
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
