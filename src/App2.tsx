import React, { useRef, useEffect } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) return;
    
    const ctx = canvas.getContext("2d");

    const handleMouseDown = (e) => {
      isDrawing.current = true;
      startX.current = e.clientX - canvas.getBoundingClientRect().left;
      startY.current = e.clientY - canvas.getBoundingClientRect().top;
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current) return;

      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //drawLine(ctx, startX.current, startY.current, mouseX, mouseY);
      const angle = Math.atan2(200 - 100, 250 - 150);
      const length = Math.sqrt(
        (mouseX - startX.current) ** 2 + (mouseY - startY.current) ** 2
      );

      ctx.beginPath();
      ctx.moveTo(startX.current, startY.current);
      ctx.lineTo(
        startX.current + length * Math.cos(angle),
        startY.current + length * Math.sin(angle)
      );
      ctx.stroke();
      ctx.closePath();
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const drawLine = (ctx, x1, y1, x2, y2) => {
    const angle = Math.atan2(200 - 200, 250 - 150);
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + length * Math.cos(angle), y1 + length * Math.sin(angle));
    ctx.stroke();
    ctx.closePath();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-black"
      />
    </div>
  );
};

export default App;
