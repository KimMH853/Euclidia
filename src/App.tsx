import React, { useEffect, useRef, useState } from "react";

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
  const [pointArray, setPointArray] = useState<
    { tag: string; x: number; y: number; isClicked: boolean }[]
  >([
    { tag: "A", x: 100, y: 200, isClicked: false },
    { tag: "B", x: 300, y: 200, isClicked: false },
  ]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [clickedPoints, setClickedPoints] = useState<
    { x: number; y: number }[]
  >([]);
  const [shapeType, setShapeType] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pointArray.forEach((point) => {
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
    
  }, [pointArray, shapes, ]);

  useEffect(()=>{
    if (clickedPoints.length === 2) {
      const [startPoint, endPoint] = clickedPoints;

      const newShape: Shape = {
        type: shapeType,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        selected: false,
      };

      setShapes((prevShapes) => [...prevShapes, newShape]);
      setClickedPoints([]);
      setShapeType("");
    }
  },[clickedPoints, shapeType])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const updatedPoints = pointArray.map((point) => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      const isClicked = distance <= 10;
      if (isClicked) {
        setClickedPoints((prevClicked) => [
          ...prevClicked,
          { x: point.x, y: point.y },
        ]);
      }
      return {
        ...point,
        isClicked: point.isClicked || isClicked,
      };
    });

    setPointArray(updatedPoints);
  };

  const handleTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShapeType(event.currentTarget.name);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        1. On a given finite right line (AB) to construct an equilateral
        triangle.
      </div>
      <div className="m-2">
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          name="line"
          onClick={handleTypeClick}
        >
          직선
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
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
        <div> {JSON.stringify(clickedPoints)}</div>
        <div> {JSON.stringify(shapes)}</div>
      </div>
    </div>
  );
};

export default App;
