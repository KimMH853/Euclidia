import React, { useEffect, useRef, useState } from 'react';
import pointToLineDistance from './util/pointToLineDistance';

type Shape = {
    type: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    selected: boolean,
  };
  


const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [shapeChoices, setShapeChoices] = useState<Shape[]>([]);
  const [clickedPoints, setClickedPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => {
      if (shape.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.strokeStyle = shape.selected ? 'red' : 'black';
        ctx.stroke();
      } else if (shape.type === 'circle') {
        const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2);
        ctx.beginPath();
        ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = shape.selected ? 'blue' : 'black';
        ctx.stroke();
      }
    });

    shapeChoices.forEach((shape) => {
      if (shape.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.strokeStyle = shape.selected ? 'red' : 'black';
        ctx.stroke();
      } else if (shape.type === 'circle') {
        const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2);
        ctx.beginPath();
        ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = shape.selected ? 'blue' : 'black';
        ctx.stroke();
      }
    });

    if (clickedPoints.length === 2) {
      const startPoint = clickedPoints[0];
      const endPoint = clickedPoints[1];


      const newLine: Shape = {
        type: 'line',
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        selected: false,
      };

      const newCircle: Shape = {
        type: 'circle',
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        selected: false,
      };

      setShapeChoices((prevShapes) => [...prevShapes, newLine, newCircle]);
      setClickedPoints([]);
    }
  }, [shapes, shapeChoices, clickedPoints]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if(shapeChoices.length === 2) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setClickedPoints((prevClickedPoints) => [...prevClickedPoints, { x, y }]);
  };

  const isWithinLine = (x: number, y: number, line: Shape): boolean => {
    const distance = pointToLineDistance(x, y, line.startX, line.startY, line.endX, line.endY);
    const pointArea = Math.sqrt((line.endX - x) ** 2 + (line.endY - y) ** 2);
    return distance <= 10 && pointArea > 20;
    };

  const isWithinCircle = (x: number, y: number, circle: Shape): boolean => {
    const radius = Math.sqrt((circle.startX - circle.endX) ** 2 + (circle.startY - circle.endY) ** 2);
    const distance = Math.sqrt((x - circle.startX) ** 2 + (y - circle.startY) ** 2);
    const pointArea = Math.sqrt((circle.endX - x) ** 2 + (circle.endY - y) ** 2);
    return distance < radius + 10 && distance > radius - 10 && pointArea > 20;
  };
  
  const handleShapeClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (shapeChoices.length !== 2) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    if (shapeChoices[0].type === 'line' && isWithinLine(x, y, shapeChoices[0])) {
      // 좌표가 직선에서 10 이내인 경우
      console.log('Clicked within line');
      setShapes((prevShapes)=>[...prevShapes, shapeChoices[0]])
      setShapeChoices([]);
    }
    
    if (shapeChoices[1].type === 'circle' && isWithinCircle(x, y, shapeChoices[1])) {
      // 좌표가 원에서 10 이내인 경우
      console.log('Clicked within circle');
      setShapes((prevShapes)=>[...prevShapes, shapeChoices[1]])
      setShapeChoices([]);
    }
  };
  const handleCombinedClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    handleCanvasClick(event);
    handleShapeClick(event);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">Draw a line or a circle by clicking two points</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-black"
        onClick={handleCombinedClick}
      />
      
    </div>
  );
};

export default App;
