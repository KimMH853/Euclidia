import React, { useEffect, useRef, useState } from 'react';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pointArray, setPointArray] = useState<{ tag: string; x: number; y: number; color: string }[]>([
    { tag: 'A', x: 100, y: 200, color: 'black' },
    { tag: 'B', x: 300, y: 200, color: 'black' },
  ]);
  const [clickedPoints, setClickedPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pointArray.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = point.color;
      ctx.fill();

      ctx.font = '12px sans-serif';
      ctx.fillText(point.tag, point.x - 4, point.y - 6);
    });

    if (clickedPoints.length === 2) {
      const startPoint = clickedPoints[0];
      const endPoint = clickedPoints[1];

      const radius = Math.sqrt((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2);

      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'black';
      ctx.stroke();
    }
  }, [pointArray, clickedPoints]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedPointIndex = pointArray.findIndex((point) => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      return distance <= 10;
    });

    if (clickedPointIndex !== -1) {
      const clickedPoint = pointArray[clickedPointIndex];
      setClickedPoints((prevClickedPoints) => [...prevClickedPoints, { x: clickedPoint.x, y: clickedPoint.y }]);
      setPointArray((prevPointArray) => {
        const updatedPointArray = [...prevPointArray];
        updatedPointArray[clickedPointIndex].color = 'blue';
        return updatedPointArray;
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        1. On a given finite right line (AB) to construct an equilateral triangle.
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-black"
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default App;
