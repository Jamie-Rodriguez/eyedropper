import { FunctionComponent, RefObject } from 'react';


const ColorPicker: FunctionComponent<{
  pickerRef: RefObject<HTMLCanvasElement>;
  x: number;
  y: number;
  imageData: ImageData | null;
  color: string
}> = ({ pickerRef, x, y, imageData, color }) => {
  const size = 50;
  const zoomSize = 10;


  return (
    <div id='color-picker'
      style={{
        border: `2px solid ${color}`,
        top: y - size / 2,
        left: x - size / 2
      }}>
      {imageData && (
        <canvas
          width={zoomSize}
          height={zoomSize}
          style={{
            display: 'block',
            margin: 'auto',
            marginTop: (size - zoomSize) / 2,
            imageRendering: 'pixelated',
          }}
          ref={pickerRef}
        />
      )}
    </div>
  );
};

export default ColorPicker;
