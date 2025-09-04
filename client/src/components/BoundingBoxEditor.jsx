import { useEffect, useRef } from "react";
import { fabric } from "fabric";

const BoundingBoxEditor = ({ imageUrl, initialBoxes = [], onChange }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
    });

    // Load background image (page)
    fabric.Image.fromURL(imageUrl, (img) => {
      canvas.setBackgroundImage(
        img,
        canvas.renderAll.bind(canvas),
        {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        }
      );
    });

    // Add initial boxes
    initialBoxes.forEach((box) => {
      const rect = new fabric.Rect({
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        fill: "rgba(255, 0, 0, 0.2)",
        stroke: "red",
        strokeWidth: 2,
        hasBorders: true,
        hasControls: true,
        lockRotation: true,
      });
      rect.articleId = box.id;
      canvas.add(rect);
    });

    // Enable drawing new boxes
    let isDrawing = false;
    let startX, startY, rect;

    canvas.on("mouse:down", (opt) => {
      if (opt.target) return; // clicked existing object
      isDrawing = true;
      const pointer = canvas.getPointer(opt.e);
      startX = pointer.x;
      startY = pointer.y;
      rect = new fabric.Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: "rgba(0, 0, 255, 0.2)",
        stroke: "blue",
        strokeWidth: 2,
      });
      canvas.add(rect);
    });

    canvas.on("mouse:move", (opt) => {
      if (!isDrawing) return;
      const pointer = canvas.getPointer(opt.e);
      rect.set({
        width: pointer.x - startX,
        height: pointer.y - startY,
      });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      if (isDrawing) {
        isDrawing = false;
        updateBoxes();
      }
    });

    // Update on object move/resize
    canvas.on("object:modified", updateBoxes);

    function updateBoxes() {
      const boxes = canvas.getObjects("rect").map((r, i) => ({
        id: r.articleId || `temp-${i}`,
        x: r.left,
        y: r.top,
        width: r.width * r.scaleX,
        height: r.height * r.scaleY,
      }));
      if (onChange) onChange(boxes);
    }

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  return (
    <canvas ref={canvasRef} width={800} height={1200} />
  );
};

export default BoundingBoxEditor;
