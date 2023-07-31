import React, { useEffect, useRef, useState } from "react";
import distanceBetweenPoints from "./util/distanceBetweenPoints";
import equilateralTriangle from "./checkAnswer/equilateralTriangle";
import makeComparableValue from "./util/makeComparableValue";
import getNewCoordinates from "./util/getNewCoordinates";

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

  const [coordinates, setCoordinates] = useState<
    { tag: string; x: number; y: number; selected: boolean }[]
  >([
    { tag: "A", x: 150, y: 200, selected: false },
    { tag: "B", x: 250, y: 200, selected: false },
  ]);

  const [currentSelectedTool, setCurrentSelectedTool] = useState("");

  const [shapeType, setShapeType] = useState("");
  const [isLineSelected, setIsLineSelected] = useState<boolean>(false);
  const [isCircleSelected, setIsCircleSelected] = useState<boolean>(false);
  const [prevCircleShapesCount, setPrevCircleShapesCount] = useState(1);
  const [isAnswer, setIsAnswer] = useState(false);
  const [isAnswerClicked, setIsAnswerClicked] = useState(false);

  const [shapes, setShapes] = useState<Shape[]>([]);
  let selectedCoordinates: { x: number; y: number }[] = [];

  //점과 도형 그리기
  useEffect(() => {
    initDraw();
  }, []);

  const initDraw = () => {
    // 초기 문제 그려주기(문제와 관련된 점 그려주기)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    coordinates.forEach((coordinate) => {
      ctx.beginPath();
      ctx.arc(coordinate.x, coordinate.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillText(coordinate.tag, coordinate.x - 4, coordinate.y - 6);
    });
  };

  const drawCoordinate = (ctx: CanvasRenderingContext2D) => {
    coordinates.forEach((coordinate) => {
      ctx.beginPath();
      ctx.arc(coordinate.x, coordinate.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = coordinate.selected ? "blue" : "black";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillText(coordinate.tag, coordinate.x - 4, coordinate.y - 6);
    });
  };

  const drawShape = (ctx: CanvasRenderingContext2D) => {
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
  };

  const addSelectedCoordinates = (x: number, y: number) => {
    const clickedCoordinate = coordinates.filter(
      (coordinate) =>
        Math.abs(coordinate.x - x) < 20 && Math.abs(coordinate.y - y) < 20
    );
    if (clickedCoordinate.length !== 1) return;

    const selectedCoordIndex = selectedCoordinates.findIndex(
      (item) =>
        item.x === clickedCoordinate[0].x && item.y === clickedCoordinate[0].y
    );

    if (selectedCoordIndex === -1) {
      selectedCoordinates.push({
        x: clickedCoordinate[0].x,
        y: clickedCoordinate[0].y,
      });
    } else {
      selectedCoordinates.splice(selectedCoordIndex, 1);
    }

    //선택한 좌표 색 변경
    const coordIndex = coordinates.findIndex(
      (item) =>
        item.x === clickedCoordinate[0].x && item.y === clickedCoordinate[0].y
    );

    if (coordIndex !== -1) {
      coordinates[coordIndex].selected = !coordinates[coordIndex].selected;
    }
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    currentSelectedTool: string
  ) => {
    const [start, end] = selectedCoordinates;

    

    const newShape: Shape = {
      type: currentSelectedTool,
      startX: start.x,
      startY: start.y,
      endX: end.x,
      endY: end.y,
      selected: false,
    };

    const isShapeAlreadyExist = shapes.some(
      (shape) =>
        shape.type === newShape.type &&
        shape.startX === newShape.startX &&
        shape.startY === newShape.startY &&
        shape.endX === newShape.endX &&
        shape.endY === newShape.endY
    );
    if (isShapeAlreadyExist) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    selectedCoordinates = [];
    setShapes((prev) => [...prev, newShape]);
    coordinates.forEach((coordinate) => (coordinate.selected = false));
  };

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    currentSelectedTool: string
  ) => {
    
    const [start, end] = selectedCoordinates;
    const newShape: Shape = {
      type: currentSelectedTool,
      startX: start.x,
      startY: start.y,
      endX: end.x,
      endY: end.y,
      selected: false,
    };
    const isShapeAlreadyExist = shapes.some(
      (shape) =>
        shape.type === newShape.type &&
        shape.startX === newShape.startX &&
        shape.startY === newShape.startY &&
        shape.endX === newShape.endX &&
        shape.endY === newShape.endY
    );
    
    if (isShapeAlreadyExist) return; 

    
    const radius = distanceBetweenPoints(start.x, start.y, end.x, end.y);
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    selectedCoordinates = [];
    setShapes((prev) => [...prev, newShape]);
    coordinates.forEach((coordinate) => (coordinate.selected = false));

    //새로운 좌표 얻기
    //1. shapes에 원이 1개 이상이면
    const circles = shapes.filter((shape)=>shape.type === 'circle')
    if(circles.length === 0) return;

    //2. 새 좌표를 얻는다
    const newCoordinates:{x:number,y:number}[] = [];
    circles.forEach((circle) =>{
      const existingCircleRadius = distanceBetweenPoints(circle.startX, circle.startY, circle.endX, circle.endY)
      const result = getNewCoordinates(start.x, start.y, radius, circle.startX, circle.startY, existingCircleRadius)
      newCoordinates.push(...result);
    })
    //3. 기존 좌표와 중복체크
    const nonOverlappingCoordinates = newCoordinates.filter(
      ({ x, y }) =>
        !coordinates.some(() => {
          const comparableX = makeComparableValue(x);
          const comparableY = makeComparableValue(y);
          return coordinates.some(
            (coordinate) =>
              makeComparableValue(coordinate.x) === comparableX &&
              makeComparableValue(coordinate.y) === comparableY
          );
        })
    );

    //4. 그리기
    if(nonOverlappingCoordinates.length ===0) return;
    nonOverlappingCoordinates.forEach(({x, y}, index)=>{
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillText(String.fromCharCode(coordinates.length + index + 65), x - 4, y - 6);
    })

    setCoordinates((prev)=>[...prev, ...nonOverlappingCoordinates.map((coordinate, index) => ({
      tag: String.fromCharCode(coordinates.length + index +65),
      x: coordinate.x,
      y: coordinate.y,
      selected: false,
    }))])

  };

  const deleteShape = () => {
    //
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 선택된 툴이 없을 시 return

    // 클릭 된 지점의 좌표의 위치를 점 배열과 비교 하고 거리가 10 이내면, 점을 그리기위한배열에 좌표 추가
    addSelectedCoordinates(x, y);

    // 조건1. 선택된 툴이 직선일 때
    if (currentSelectedTool === "line" && selectedCoordinates.length === 2) {
      drawLine(ctx, currentSelectedTool);
    }

    // 조건2. 선택된 툴이 원일 때
    if (currentSelectedTool === "circle" && selectedCoordinates.length === 2) {
      drawCircle(ctx, currentSelectedTool);
    }

    // 조건3. 선택된 툴이 지우개일 때

    // 직선이나 원이 그려진 좌표를 클릭시 해당 도형을 지움

    drawCoordinate(ctx);
    drawShape(ctx);
  };

  const handleClickLineButton = () => {
    // 직선버튼 클릭 -> 선택된 툴 직선으로 변경
    if (currentSelectedTool === "line") {
      setCurrentSelectedTool("");
    } else {
      setCurrentSelectedTool("line");
    }
  };

  const handleClickCircleButton = () => {
    // 원버튼 클릭 -> 선택된 툴 원으로 변경
    if (currentSelectedTool === "circle") {
      setCurrentSelectedTool("");
    } else {
      setCurrentSelectedTool("circle");
    }
  };

  const handleClickEraseButton = () => {
    // 지우개버튼 클릭 -> 선택된 툴을 지우개로 변경
    if (currentSelectedTool === "erase") {
      setCurrentSelectedTool("");
    } else {
      setCurrentSelectedTool("erase");
    }
  };

  const handleAnswerButtonClick = () => {
    //
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        On a given finite right line (AB) to construct an equilateral triangle.
      </div>

      <div className="m-2">
        <button
          className={`mr-2 px-4 py-2 ${
            currentSelectedTool === "line"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="line"
          onClick={handleClickLineButton}
        >
          직선
        </button>

        <button
          className={`mr-2 px-4 py-2 ${
            currentSelectedTool === "circle"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="circle"
          onClick={handleClickCircleButton}
        >
          원
        </button>
        <button
          className={`mr-2 px-4 py-2 ${
            currentSelectedTool === "erase"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="erase"
          onClick={handleClickEraseButton}
        >
          삭제
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
        {/* <div> points {JSON.stringify(points)}</div> */}
        <div> coordinates {JSON.stringify(coordinates)}</div>
        <div> shapes {JSON.stringify(shapes)}</div>
        <div> selectedCoordinates {JSON.stringify(selectedCoordinates)}</div>
      </div>
    </div>
  );
};

export default App;
