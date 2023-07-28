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

  const shapes: Shape[] =[];
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
  }

  const addSelectedCoordinates = (x: number, y:number) => {
    const clickedCoordinate = coordinates.filter((coordinate)=> Math.abs(coordinate.x - x) < 20 && Math.abs(coordinate.y - y) < 20)
    if(clickedCoordinate.length !== 1) return;
    
    const index = selectedCoordinates.findIndex(item => item.x === clickedCoordinate[0].x && item.y === clickedCoordinate[0].y);
    
    if(index === -1) {
      selectedCoordinates.push({x: clickedCoordinate[0].x, y: clickedCoordinate[0].y})
    } else {
      selectedCoordinates.splice(index, 1);
    }
  }

  const drawLine = (ctx: CanvasRenderingContext2D, currentSelectedTool: string )=> {
    
    ctx.beginPath();
    ctx.moveTo(selectedCoordinates[0].x, selectedCoordinates[0].y);
    ctx.lineTo(selectedCoordinates[1].x, selectedCoordinates[1].y);
    ctx.stroke();

    const newShape: Shape = {
      type: currentSelectedTool,
      startX: selectedCoordinates[0].x,
      startY: selectedCoordinates[0].y,
      endX: selectedCoordinates[1].x,
      endY: selectedCoordinates[1].y,
      selected: false,
    };

    shapes.push(newShape);
    selectedCoordinates = [];

  }

  const drawCircle = () => {
    //
  }

  const deleteShape = () => {
    //
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 선택된 툴이 없을 시 return

    // 클릭 된 지점의 좌표의 위치를 점 배열과 비교 하고 거리가 10 이내면, 점을 그리기위한배열에 좌표 추가
    addSelectedCoordinates(x,y);
    // 조건1. 선택된 툴이 직선일 때
    if(currentSelectedTool === 'line' && selectedCoordinates.length ===2) {
      // 추가된 좌표가 2개라면, 2개 좌표간의 거리를 구해서 직선 그려주기
      drawLine(ctx, currentSelectedTool);
    }
    
    
    // 조건2. 선택된 툴이 원일 때

    // 추가된 좌표가 2개라면, 2개 좌표간의 거리를 구해서 원을 그려주기

    // 조건3. 선택된 툴이 지우개일 때

    // 직선이나 원이 그려진 좌표를 클릭시 해당 도형을 지움
  }

  const handleClickLineButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 직선버튼 클릭 -> 선택된 툴 직선으로 변경
    if(currentSelectedTool ==="line") {
      setCurrentSelectedTool("");
    } else {
      setCurrentSelectedTool("line");
    } 
    

  }

  const handleClickCircleButton = () => {
    // 원버튼 클릭 -> 선택된 툴 원으로 변경
    setCurrentSelectedTool("circle");
  }

  const handleClickEraseButton = () => {
    // 지우개버튼 클릭 -> 선택된 툴을 지우개로 변경
    setCurrentSelectedTool("erase")
  }

  const handleAnswerButtonClick = () => {
    // 
  }

  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        On a given finite right line (AB) to construct an equilateral triangle.
      </div>

      <div className="m-2">
        <button
          className={`mr-2 px-4 py-2 ${
            currentSelectedTool==="line"
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
            isCircleSelected
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
            isCircleSelected
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="circle"
          onClick={handleClickCircleButton}
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
        {/* <div> clickedPoints {JSON.stringify(clickedPoints)}</div> */}
        <div> shapes {JSON.stringify(shapes)}</div>
        <div> selectedCoordinates {JSON.stringify(selectedCoordinates)}</div>
      </div>
    </div>
  );
};

export default App;
