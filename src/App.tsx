import React, { useEffect, useRef, useState } from "react";
import distanceBetweenPoints from "./util/getDistanceBetweenCoordinates";
import equilateralTriangle from "./checkAnswer/equilateralTriangle";
import makeComparableValue from "./util/makeComparableValue";
import getNewCoordinates from "./util/getNewCoordinates";
import getDistanceToLine from "./util/getDistanceToLine";
import getDistanceBetweenCoordinates from "./util/getDistanceBetweenCoordinates";
import coordinatesData from "./problems/coordinatesData";
import shapesData from "./problems/shapesData";
import problemsData from "./problems/problemsData";
import getNewCoordinatesLineAndCircle from "./util/getNewCoordinatesLineAndCircle";

type Shape = {
  type?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  selected?: boolean;
  extension?: boolean;
};

type Coordinate = {
  tag?: string;
  x: number;
  y: number;
  selected?: boolean;
};

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentSelectedTool, setCurrentSelectedTool] = useState("");
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  const [problemText, setProblemText] = useState("");
  const [problemIndex, setProblemIndex] = useState(0);

  const selectedCoordinates = useRef<Coordinate[]>([]);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const clickedCoord = useRef<{ x: number; y: number; angle: number } | null>(null);

  //점과 도형 그리기
  useEffect(() => {
    initDraw();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawShape(ctx);
    drawCoordinate(ctx);
  }, [coordinates, shapes]);

  useEffect(() => {
    const savedCoordinates = localStorage.getItem("coordinates");
    const savedShapes = localStorage.getItem("shapes");
    const savedProblems = localStorage.getItem("problems");

    if (savedProblems) {
      setProblemText(JSON.parse(savedProblems));
    } else {
      setProblemText(problemsData[problemIndex]);
    }

    if (savedCoordinates) {
      setCoordinates(JSON.parse(savedCoordinates));
    } else {
      setCoordinates(coordinatesData[problemIndex]);
    }

    if (savedShapes) {
      setShapes(JSON.parse(savedShapes));
    } else {
      setShapes(shapesData[problemIndex]);
    }
  }, [problemIndex]);

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
      ctx.fillText(coordinate.tag!, coordinate.x - 4, coordinate.y - 6);
    });
  };

  const drawCoordinate = (ctx: CanvasRenderingContext2D) => {
    coordinates.forEach((coordinate) => {
      ctx.beginPath();
      ctx.arc(coordinate.x, coordinate.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = coordinate.selected ? "blue" : "black";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillText(coordinate.tag!, coordinate.x - 4, coordinate.y - 6);
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

  const addCoordinate = (x: number, y: number) =>{
    //직선에만 점찍기 가능
    
    //직선 위를 클릭 했는지 확인 하기
    const clickedLine = shapes.find((shape) => {
      const { type, startX, startY, endX, endY } = shape;
      if (type === "line") {
        const distance = getDistanceToLine(x, y, startX, startY, endX, endY);
        if (distance < 10) {
          return true;
        }
      }
    });

    //직선의 방정식 알아 냄

    console.log(clickedLine)
    if(clickedLine){
      const gradient = (clickedLine.endY-clickedLine.startY)/(clickedLine.endX-clickedLine.startX);
      const yIntercept = clickedLine.startY - gradient*clickedLine.startX;
      const lineEqY = `x * ${gradient} + ${yIntercept}`

      const newY = x * gradient + yIntercept;
      
      setCoordinates((prev)=> [...prev, {
        tag: String.fromCharCode(coordinates.length + 65),
        x: x,
        y: newY,
        selected: false}])
      
    }
    
    //방정식에 x 값 대입해서 좌표 생성
  }

  const addSelectedCoordinates = (x: number, y: number): boolean => {
    const clickedCoordinate = coordinates.filter(
      (coordinate) =>
        Math.abs(coordinate.x - x) < 20 && Math.abs(coordinate.y - y) < 20
    );
    if (clickedCoordinate.length !== 1) return false;

    const selectedCoordIndex = selectedCoordinates.current.findIndex(
      (item) =>
        item.x === clickedCoordinate[0].x && item.y === clickedCoordinate[0].y
    );

    if (selectedCoordIndex === -1) {
      selectedCoordinates.current.push({
        x: clickedCoordinate[0].x,
        y: clickedCoordinate[0].y,
      });
    } else {
      selectedCoordinates.current.splice(selectedCoordIndex, 1);
    }

    //선택한 좌표 색 변경
    const coordIndex = coordinates.findIndex(
      (item) =>
        item.x === clickedCoordinate[0].x && item.y === clickedCoordinate[0].y
    );

    if (coordIndex !== -1) {
      coordinates[coordIndex].selected = !coordinates[coordIndex].selected;
      return true;
    } else {
      return false;
    }
  };

  const selectLine = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isCoordClicked: boolean
  ) => {
    shapes.forEach((shape) => {
      const { type, startX, startY, endX, endY } = shape;
      if (type === "line") {
        const distance = getDistanceToLine(x, y, startX, startY, endX, endY);

        if (distance < 10 && !isCoordClicked) {
          shape.selected = !shape.selected;

          // if(shape.selected){
          //   ctx.beginPath();
          //   ctx.arc(shape.startX, shape.startY, 4, 0, 2 * Math.PI);
          //   ctx.arc(shape.endX, shape.endY, 4, 0, 2 * Math.PI);
          //   ctx.fillStyle = "black";
          //   ctx.fill();
          //   ctx.strokeStyle = "black";
          //   ctx.stroke();
          // }
        }
      }
      return true; // 다른 타입의 도형은 그대로 유지
    });
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    currentSelectedTool: string
  ) => {
    const [start, end] = selectedCoordinates.current;

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
    selectedCoordinates.current = [];
    setShapes((prev) => [...prev, newShape]);
    coordinates.forEach((coordinate) => (coordinate.selected = false));
  };

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    currentSelectedTool: string
  ) => {
    const [start, end] = selectedCoordinates.current;
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
    selectedCoordinates.current = [];
    setShapes((prev) => [...prev, newShape]);
    coordinates.forEach((coordinate) => (coordinate.selected = false));

    //새로운 좌표 얻기
    //1. shapes에 원이 1개 이상이면
    const circles = shapes.filter((shape) => shape.type === "circle");
    if (circles.length === 0) return;

    //2. 새로운 원과 기존의 원들의 겹치는 부분의 좌표를 얻는다
    const newCoordinates: { x: number; y: number }[] = [];

    circles.forEach((circle) => {
      const existingCircleRadius = distanceBetweenPoints(
        circle.startX,
        circle.startY,
        circle.endX,
        circle.endY
      );

      const result = getNewCoordinates(
        start.x,
        start.y,
        radius,
        circle.startX,
        circle.startY,
        existingCircleRadius
      );
      newCoordinates.push(...result);
    });

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
    if (nonOverlappingCoordinates.length === 0) return;
    nonOverlappingCoordinates.forEach(({ x, y }, index) => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.font = "12px sans-serif";
      ctx.fillText(
        String.fromCharCode(coordinates.length + index + 65),
        x - 4,
        y - 6
      );
    });

    setCoordinates((prev) => [
      ...prev,
      ...nonOverlappingCoordinates.map((coordinate, index) => ({
        tag: String.fromCharCode(coordinates.length + index + 65),
        x: coordinate.x,
        y: coordinate.y,
        selected: false,
      })),
    ]);

    
    const extendedLines = shapes.filter((shape) => shape.extension === true);
    if(extendedLines) {
      extendedLines.forEach((line)=>{
        const result = getNewCoordinatesLineAndCircle(line.startX, line.startY, line.endX, line.endY, start.x, start.y, radius,)
        if (result) {
          //console.log(result);
          const isDuplication = coordinates.some(
            (coord) =>
              makeComparableValue(result.x) === makeComparableValue(coord.x) &&
              makeComparableValue(result.y) === makeComparableValue(coord.y)
          );
          if (!isDuplication) {
            setCoordinates((prev) => [
              ...prev,
              {
                tag: String.fromCharCode(coordinates.length + 66),
                x: result.x,
                y: result.y,
                selected: false,
              },
            ]);
          }
        }
      })
    }
  };

  const deleteShape = (x: number, y: number) => {
    let clickedShape: Shape[] = [];

    // 직선을 클릭한 건지 확인하기
    clickedShape = shapes.filter((shape) => {
      const { type, startX, startY, endX, endY } = shape;
      if (type === "line") {
        const distance = getDistanceToLine(x, y, startX, startY, endX, endY);
        const coordinateArea = getDistanceBetweenCoordinates(endX, x, endY, y);
        return distance >= 10 || coordinateArea <= 20;
      }
      return true; // 다른 타입의 도형은 그대로 유지
    });

    // 원을 클릭한 건지 확인하기
    clickedShape = clickedShape.filter((shape) => {
      const { type, startX, startY, endX, endY } = shape;
      if (type === "circle") {
        const radius = getDistanceBetweenCoordinates(
          startX,
          startY,
          endX,
          endY
        );
        const distance = getDistanceBetweenCoordinates(startX, startY, x, y);
        return Math.abs(radius - distance) > 10; // 클릭한 거리가 반지름보다 크거나 같으면 유지
      }
      return true; // 다른 타입의 도형은 그대로 유지
    });

    setShapes(clickedShape); // shapes 배열 업데이트
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
    if (currentSelectedTool === "") {
      alert("선택된 도구가 없습니다. 도구를 선택해주세요!");
    }

    // 클릭 된 지점의 좌표의 위치를 점 배열과 비교 하고 거리가 10 이내면, 점을 그리기위한배열에 좌표 추가
    if (currentSelectedTool === "line" || currentSelectedTool === "circle") {
      const isCoordClicked = addSelectedCoordinates(x, y);
      const selectedLine = selectLine(ctx, x, y, isCoordClicked);
    }

    // 조건1. 선택된 툴이 직선일 때
    if (
      currentSelectedTool === "line" &&
      selectedCoordinates.current.length === 2
    ) {
      drawLine(ctx, currentSelectedTool);
    }

    // 조건2. 선택된 툴이 원일 때
    if (
      currentSelectedTool === "circle" &&
      selectedCoordinates.current.length === 2
    ) {
      drawCircle(ctx, currentSelectedTool);
     
    }

    drawCoordinate(ctx);
    drawShape(ctx);

    if(currentSelectedTool === "coordinate") {
      addCoordinate(x, y);
    }

    // 조건3. 선택된 툴이 지우개일 때 직선이나 원을 클릭시 해당 도형을 지움
    if (currentSelectedTool === "erase") {
      deleteShape(x, y);
    }
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

  const handleClickCoordButton = () => {
    //
    if (currentSelectedTool === "coordinate") {
      setCurrentSelectedTool("");
    } else {
      setCurrentSelectedTool("coordinate");
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

  const handleClickAnswerButton = () => {
    //정답확인 버튼 클릭
    const triangle = equilateralTriangle(shapes);
    if (triangle) {
      const updatedShapes = shapes.map((shape) =>
        triangle.includes(shape) ? { ...shape, selected: true } : shape
      );
      setShapes(updatedShapes);
      setIsWrongAnswer(false);
    } else {
      setIsWrongAnswer(true);
    }
  };

  const handleClickBeforeProblem = () => {
    setProblemIndex((prev) => {
      if (prev === 0) {
        alert("첫번째 문제입니다.");
        return prev;
      } else {
        return prev - 1;
      }
    });
  };

  const handleClickNextProblem = () => {
    setProblemIndex((prev) => {
      if (prev === 4) {
        alert("마지막 문제입니다.");
        return prev;
      } else {
        return prev + 1;
      }
    });
  };

  const handleCanvasWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1; // 확대 또는 축소 비율

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 확대 또는 축소된 좌표 및 도형 그리기
    coordinates.forEach((coordinate) => {
      coordinate.x = (coordinate.x - x) * scaleFactor + x;
      coordinate.y = (coordinate.y - y) * scaleFactor + y;
    });

    shapes.forEach((shape) => {
      shape.startX = (shape.startX - x) * scaleFactor + x;
      shape.startY = (shape.startY - y) * scaleFactor + y;
      shape.endX = (shape.endX - x) * scaleFactor + x;
      shape.endY = (shape.endY - y) * scaleFactor + y;
    });

    drawCoordinate(ctx);
    drawShape(ctx);
  };

  const handleCanvasDragStart = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    //if(currentSelectedTool !== "move") return;

    lastMousePosition.current = { x: event.clientX, y: event.clientY };

    clickedCoord.current = null;
  };

  const handleCanvasDrag = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!lastMousePosition.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = lastMousePosition.current.x - rect.left;
    const canvasY = lastMousePosition.current.y - rect.top;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const deltaX = event.clientX - lastMousePosition.current.x;
    const deltaY = event.clientY - lastMousePosition.current.y;

    // Calculate the distance between the two points
    const distance = Math.sqrt(
      (mouseX - canvasX) ** 2 + (mouseY - canvasY) ** 2
    );

    // Only draw the line if the distance is 10 or more
    if (distance >= 10) {
      // 클릭한 지점이 좌표 안에 있는지 확인
      const clickedCoordinate = coordinates.find(
        (coordinate) =>
          Math.abs(coordinate.x - canvasX) < 20 &&
          Math.abs(coordinate.y - canvasY) < 20
      );

      if (clickedCoordinate) {
        const selectedLine = shapes.find(
          (shape) =>
            shape.type === "line" &&
            ((shape.startX === clickedCoordinate.x &&
              shape.startY === clickedCoordinate.y) ||
              (shape.endX === clickedCoordinate.x &&
                shape.endY === clickedCoordinate.y)) &&
            shape.selected === true
        );

        if (
          selectedLine &&
          (Math.abs(deltaX) >= 10 || Math.abs(deltaY) >= 10)
        ) {
          let angle = 0;
          if (
            selectedLine.startX === clickedCoordinate.x &&
            selectedLine.startY === clickedCoordinate.y
          ) {
            angle = Math.atan2(
              selectedLine.startY - selectedLine.endY,
              selectedLine.startX - selectedLine.endX
            );
          } else {
            angle = Math.atan2(
              selectedLine.endY - selectedLine.startY,
              selectedLine.endX - selectedLine.startX
            );
          }

          const newEndX = clickedCoordinate.x + distance * Math.cos(angle);
          const newEndY = clickedCoordinate.y + distance * Math.sin(angle);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.beginPath();
          ctx.moveTo(clickedCoordinate.x, clickedCoordinate.y);
          ctx.lineTo(newEndX, newEndY);
          ctx.stroke();
          ctx.closePath();

          clickedCoord.current = {
            x: clickedCoordinate.x,
            y: clickedCoordinate.y,
            angle,
          };
          // 모든 좌표와 도형 다시 그리기
          drawCoordinate(ctx);
          drawShape(ctx);
        }
      } else if (
        (!clickedCoordinate && Math.abs(deltaX) >= 10) ||
        Math.abs(deltaY) >= 10
      ) {
        // 이동 거리가 10 이상일 때에만 좌표 및 도형 이동 처리
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 좌표 및 도형 이동
        coordinates.forEach((coordinate) => {
          coordinate.x += deltaX;
          coordinate.y += deltaY;
        });

        shapes.forEach((shape) => {
          shape.startX += deltaX;
          shape.startY += deltaY;
          shape.endX += deltaX;
          shape.endY += deltaY;
        });

        drawCoordinate(ctx);
        drawShape(ctx);

        lastMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    }
  };

  const handleCanvasDragEnd = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!lastMousePosition.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // clickedCoord.current가 존재할 때만 처리
    if (clickedCoord.current) {
      const length = Math.sqrt(
        (mouseX - clickedCoord.current.x) ** 2 +
          (mouseY - clickedCoord.current.y) ** 2
      );
      const newEndX =
        clickedCoord.current.x + length * Math.cos(clickedCoord.current.angle);
      const newEndY =
        clickedCoord.current.y + length * Math.sin(clickedCoord.current.angle);

      setCoordinates((prev) => [
        ...prev,
        {
          tag: String.fromCharCode(coordinates.length + 65),
          x: newEndX,
          y: newEndY,
          selected: false,
        },
      ]);

      setShapes((prev) => [
        ...prev,
        {
          type: "line",
          startX: clickedCoord.current!.x,
          startY: clickedCoord.current!.y,
          endX: newEndX,
          endY: newEndY,
          selected: false,
          extension: true,
        },
      ]);

      // 연장된 직선과 기존 원의 교점 찾기

      //1. shapes에 원이 1개 이상이면
      const circles = shapes.filter((shape) => shape.type === "circle");
      if (circles.length === 0) return;

      //2. 새로운 원과 기존의 원들의 겹치는 부분의 좌표를 얻는다
      const newCoordinates: { x: number; y: number }[] = [];
      let i = 1;
      circles.forEach((circle) => {
        const existingCircleRadius = distanceBetweenPoints(
          circle.startX,
          circle.startY,
          circle.endX,
          circle.endY
        );

        const result = getNewCoordinatesLineAndCircle(
          clickedCoord.current!.x,
          clickedCoord.current!.y,
          newEndX,
          newEndY,
          circle.startX,
          circle.startY,
          existingCircleRadius
        );
        if (result) {
          
          const isDuplication = coordinates.some(
            (coord) =>
              makeComparableValue(result.x) === makeComparableValue(coord.x) &&
              makeComparableValue(result.y) === makeComparableValue(coord.y)
          );
          if (!isDuplication) {
            setCoordinates((prev) => [
              ...prev,
              {
                tag: String.fromCharCode(coordinates.length + 63 + i++),
                x: result.x,
                y: result.y,
                selected: false,
              },
            ]);
          }
        }
      });
    }

    
    // 마지막 마우스 위치 초기화
    lastMousePosition.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">{problemText}</div>

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
            currentSelectedTool === "coordinate"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500 border"
          } rounded cursor-pointer`}
          name="coordinate"
          onClick={handleClickCoordButton}
        >
          점
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
        onWheel={handleCanvasWheel}
        onMouseDown={handleCanvasDragStart} // 드래그 시작
        onMouseMove={handleCanvasDrag} // 드래그 중
        onMouseUp={handleCanvasDragEnd} // 드래그 종료
        onMouseLeave={handleCanvasDragEnd} // 캔버스 벗어날 시 드래그 종료
      />

      <div className="m-2">
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          name="circle"
          onClick={handleClickAnswerButton}
        >
          확인
        </button>
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          name="circle"
          onClick={handleClickBeforeProblem}
        >
          이전
        </button>
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          name="circle"
          onClick={handleClickNextProblem}
        >
          다음
        </button>

        {isWrongAnswer && <div>정삼각형이 없어요</div>}
        {/* <div> shapes {JSON.stringify(shapes)}</div> */}
        {/* <div> coordinates {JSON.stringify(coordinates)}</div> */}
      </div>
    </div>
  );
};

export default App;
