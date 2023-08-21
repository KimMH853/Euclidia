const handleCanvasDragStart = (event: React.MouseEvent<HTMLCanvasElement>) => {
  lastMousePosition.current = { x: event.clientX, y: event.clientY };
};

const handleCanvasDrag = (event: React.MouseEvent<HTMLCanvasElement>) => {
  if (!lastMousePosition.current) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const deltaX = event.clientX - lastMousePosition.current.x;
  const deltaY = event.clientY - lastMousePosition.current.y;

  if (Math.abs(deltaX) >= 10 || Math.abs(deltaY) >= 10) {
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
};

const handleCanvasDragEnd = () => {
  lastMousePosition.current = null;
};