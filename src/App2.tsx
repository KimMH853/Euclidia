import React, { useRef, useEffect, useState } from "react";

function CanvasWithZoomAndDrag() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevMousePos, setPrevMousePos] = useState<{ x: number; y: number } | null>(null);
  const [canvasPos, setCanvasPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const startPoint = { x: 100, y: 200 };
  const endPoint = { x: 300, y: 200 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      console.log("WheelEvent")
      const mousePosX = event.clientX - canvas.getBoundingClientRect().left;
      const mousePosY = event.clientY - canvas.getBoundingClientRect().top;
      const wheelDelta = Math.sign(event.deltaY);

      const zoomFactor = 1.1; // 확대/축소 배율 조절

      // 마우스 위치를 기준으로 확대/축소
      const newScale = scale * zoomFactor ** wheelDelta;
      const scaleRatio = newScale / scale;

      const offsetX = mousePosX - (mousePosX - canvasPos.x) * scaleRatio;
      const offsetY = mousePosY - (mousePosY - canvasPos.y) * scaleRatio;

      setScale(newScale);
      setCanvasPos({ x: offsetX, y: offsetY });
    };

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();

      setIsDragging(true);
      setPrevMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const mousePos = { x: event.clientX, y: event.clientY };
      const offsetX = mousePos.x - prevMousePos!.x;
      const offsetY = mousePos.y - prevMousePos!.y;

      setCanvasPos((prevPos) => ({
        x: prevPos.x + offsetX,
        y: prevPos.y + offsetY,
      }));

      setPrevMousePos(mousePos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setPrevMousePos(null);
    };

    const redrawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvasPos.x, canvasPos.y);
      ctx.scale(scale, scale);

      // 캔버스에 그리기 로직 추가
      // 시작점 그리기
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();

      // 끝점 그리기
      ctx.beginPath();
      ctx.arc(endPoint.x, endPoint.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.restore();
    };

    // 캔버스에 이벤트 리스너 등록
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    redrawCanvas();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, prevMousePos, canvasPos, scale]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <canvas ref={canvasRef} width={400} height={400} className="border border-black mb-4" />
    </div>
  );
}

export default CanvasWithZoomAndDrag;
