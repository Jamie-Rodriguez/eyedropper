import { FunctionComponent, RefObject, MouseEvent } from 'react';

const ImageCanvas: FunctionComponent<{
  imageCanvasRef: RefObject<HTMLCanvasElement>;
  handleMouseMoveOnCanvas: (event: MouseEvent<HTMLCanvasElement>) => void;
  handleClickOnCanvas: (event: MouseEvent<HTMLCanvasElement>) => void;
}> = ({
  imageCanvasRef,
  handleMouseMoveOnCanvas,
  handleClickOnCanvas,
}) => {
    return (
      <canvas id='image-canvas'
        ref={imageCanvasRef}
        onMouseMove={handleMouseMoveOnCanvas}
        onClick={handleClickOnCanvas} />
    )
  };

export default ImageCanvas;