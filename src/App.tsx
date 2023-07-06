import React, { useRef, useEffect } from 'react';

function Line({ startPoint, endPoint }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 직선 그리기
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  }, [startPoint, endPoint]);

  return (
    <canvas ref={canvasRef} width={400} height={400} />
  );
}

function App() {
  const startPoint = { x: 100, y: 100 };
  const endPoint = { x: 300, y: 300 };

  return (
    <div>
      <Line startPoint={startPoint} endPoint={endPoint} />
    </div>
  );
}

export default App;
