import { FunctionComponent, RefObject, useEffect } from 'react';
import { rgbaToHex } from '../utils';

const ColorPicker: FunctionComponent<{
  pickerRef: RefObject<HTMLCanvasElement>;
  size: number;
  color: string;
  visible: boolean;
  left: number;
  top: number;
}> = ({ pickerRef, size, color, visible, left, top }) => {

  useEffect(() => {
    if (!pickerRef.current) return;

    const pickerCanvas = pickerRef.current;
    const pickerContext = pickerCanvas.getContext('2d');

    if (!pickerContext) return;

    pickerContext.imageSmoothingEnabled = false;
  }, [pickerRef]);

  return (
    <div id='color-picker'
      style={{ visibility: visible ? 'visible' : 'hidden', left, top }}>
      <canvas ref={pickerRef}
        width={size}
        height={size}
        style={{
          display: 'block',
          margin: 'auto',
          borderRadius: '50%',
          border: `4px solid ${color}`
        }} />

      <div> {rgbaToHex(color)} </div>
    </div>
  )
}

export default ColorPicker;
