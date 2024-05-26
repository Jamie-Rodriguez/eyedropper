import { useState, useRef, useEffect, Dispatch, ChangeEvent, SetStateAction } from 'react';
import { ReactComponent as EyeDropperIcon } from './eye-dropper-solid.svg';
import './App.css';
import useWindowSize from './hooks/window-size';
import Controls from './components/Controls';
import ColorPicker from './components/ColorPicker';
import ImageCanvas from './components/ImageCanvas';
import { rgbaToHex } from './utils';

export default function App() {
  const [picking, setPicking] = useState<boolean>(false);
  const [hoveredColor, setHoveredColor] = useState<string>('#000');
  const [selectedColor, setSelectedColor] = useState<string>('#000');
  const [image, setImage] = useState<string | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomedImageData, setZoomedImageData] = useState<ImageData | null>(null);

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const pickerRef = useRef<HTMLCanvasElement>(null);

  const [width, height] = useWindowSize();

  const zoomSize = 9;
  // pickerSize needs to be a multiple of zoomSize
  // Round the user-defined size to the nearest multiple of zoomSize
  const pickerSize = Math.ceil(161 / zoomSize) * zoomSize;

  const pick = (event: React.MouseEvent<HTMLCanvasElement>, setColor: Dispatch<SetStateAction<string>>) => {
    if (!imageCanvasRef.current) return;

    const canvas = imageCanvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) return;

    const bounding = canvas.getBoundingClientRect();

    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;
    const pixel = context.getImageData(x, y, 1, 1);
    const data = pixel.data;

    const color = `rgb(${data[0]} ${data[1]} ${data[2]} / ${data[3] / 255})`;

    setColor(color);

    // if (rect) {
    //   const x = e.clientX - rect.left;
    //   const y = e.clientY - rect.top;
    //   setMousePos({ x, y });

    //   if (picking && context) {
    //     const pixelData = context.getImageData(x, y, 1, 1).data;
    //     const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    //     setColor(color);

    //     const zoomFactor = 10; // adjust as needed
    //     const zoomedData = context.getImageData(
    //       x - zoomFactor / 2,
    //       y - zoomFactor / 2,
    //       zoomFactor,
    //       zoomFactor
    //     );
    //     setZoomedImageData(zoomedData);
    //   }
    // }
  };

  const updateZoom = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageCanvasRef.current) return;

    const canvas = imageCanvasRef.current;
    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) return;

    if (!pickerRef.current) return;

    const pickerCanvas = pickerRef.current;
    const pickerContext = pickerCanvas.getContext('2d', { willReadFrequently: true });

    if (!pickerContext) return;

    const bounding = canvas.getBoundingClientRect();
    // For some reason x and y can be floats!
    // This is because the bounding.left and bounding.top properties are floats
    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;

    // pickerContext.clearRect(0, 0, pickerCanvas.width, pickerCanvas.height);

    console.log('canvas.width', canvas.width)
    console.log('x', x, '=', event.clientX, '-', bounding.left)
    console.log('y', y, '=', event.clientY, '-', bounding.top)

    // Offset the x and y coordinates in order to center the zoomed image
    // pickerContext.drawImage(canvas,
    //   Math.max(0, x - (((canvas.width % 2) === 0) ? Math.floor(zoomSize / 2) : (zoomSize / 2))),
    //   Math.max(0, y - (((canvas.height % 2) === 0) ? Math.floor(zoomSize / 2) : (zoomSize / 2))),
    //   zoomSize, zoomSize,
    //   0, 0,
    //   pickerSize, pickerSize);

    pickerContext.drawImage(canvas,
      Math.floor(Math.max(0, x - (zoomSize / 2))),
      Math.floor(Math.max(0, y - (zoomSize / 2))),
      zoomSize, zoomSize,
      0, 0,
      pickerSize, pickerSize);

    // Draw grid/pixel borders
    const lineDist = Math.ceil(pickerSize / zoomSize);

    pickerContext.strokeStyle = 'black';
    pickerContext.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= zoomSize; i++) {
      pickerContext.beginPath();
      pickerContext.moveTo(i * lineDist, 0);
      pickerContext.lineTo(i * lineDist, pickerSize);
      pickerContext.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= zoomSize; i++) {
      pickerContext.beginPath();
      pickerContext.moveTo(0, i * lineDist);
      pickerContext.lineTo(pickerSize, i * lineDist);
      pickerContext.stroke();
    }

    // Draw a white square in the center
    const centerX = Math.floor(zoomSize / 2) * lineDist;
    const centerY = Math.floor(zoomSize / 2) * lineDist;

    pickerContext.strokeStyle = 'white';
    pickerContext.lineWidth = 2;

    pickerContext.beginPath();
    pickerContext.rect(centerX, centerY, lineDist, lineDist);
    pickerContext.stroke();
  };

  // Responds to changes in the win
  useEffect(() => {
    if (image && imageCanvasRef.current) {
      // if (!pickerRef.current) return;

      // const pickerCanvas = pickerRef.current;
      // const pickerContext = pickerCanvas.getContext('2d');

      // if (!pickerContext) return;

      // pickerContext.imageSmoothingEnabled = false;
      // pickerContext.mozImageSmoothingEnabled = false;
      // pickerContext.webkitImageSmoothingEnabled = false;
      // pickerContext.msImageSmoothingEnabled = false;

      const paddingRem = 0;
      const paddingPx = paddingRem * parseFloat(getComputedStyle(document.documentElement).fontSize);

      const canvas = imageCanvasRef.current;

      const img = new Image();

      img.onload = () => {
        const scale = Math.min(
          (width - 2 * paddingPx) / img.width,
          (height - 2 * paddingPx) / img.height
        );

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        const context = canvas.getContext('2d');

        if (context) {
          context.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        }
      };

      img.src = image;
    }
  }, [image, width, height]);

  const handleEyeDropperClick = (): void => setPicking(!picking);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = e => setImage(e.target?.result as string);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleMouseMoveOnCanvas = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!imageCanvasRef.current) return;

    const canvas = imageCanvasRef.current;
    const bounding = canvas.getBoundingClientRect();
    const marginLeft = parseInt(window.getComputedStyle(canvas).marginLeft, 10);
    const x = event.clientX - bounding.left + marginLeft;
    const y = event.clientY - bounding.top;
    setMousePos({ x: x - pickerSize / 2, y });

    pick(event, setHoveredColor);
    updateZoom(event);
  };

  const handleClickOnCanvas = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (picking) {
      pick(event, setSelectedColor);
    }
  };

  return (
    <>
      <Controls
        picking={picking}
        color={selectedColor}
        handleEyeDropperClick={handleEyeDropperClick}
        handleImageUpload={handleImageUpload} />
      {/* <div id='controls-container'>
        <button
          id='toggle-button'
          className={`${picking ? 'toggle-button-active' : ''}`}
          onClick={() => {
            setPicking(!picking);
            // setButtonClicked(true);
            // setTimeout(() => setButtonClicked(false), 300);
          }}
        >
          <EyeDropperIcon
            style={{
              height: '1rem',
              width: '1rem',
            }}
          />
        </button>

        <span><strong>{rgbaToHex(selectedColor)}</strong></span>

        <input id='image-upload'
          type='file'
          // style={{ display: 'none' }}
          onChange={event => {
            if (event.target.files && event.target.files[0]) {
              const reader = new FileReader();
              reader.onload = e => setImage(e.target?.result as string);
              reader.readAsDataURL(event.target.files[0]);
            }
          }}
        />
      </div> */}

      <ColorPicker pickerRef={pickerRef}
        color={hoveredColor}
        size={pickerSize}
        visible={picking}
        left={mousePos.x}
        top={mousePos.y} />
      {/* <canvas id='color-picker' ref={pickerRef} /> */}

      {/* <ImageCanvas imageCanvasRef={imageCanvasRef}
        handleMouseMoveOnCanvas={handleMouseMoveOnCanvas}
        handleClickOnCanvas={handleClickOnCanvas} /> */}

      <canvas id='image-canvas'
        ref={imageCanvasRef}
        style={{ cursor: picking ? 'none' : 'default' }}
        onMouseMove={handleMouseMoveOnCanvas}
        onClick={handleClickOnCanvas} />
    </>
  );
};

// export default App;
