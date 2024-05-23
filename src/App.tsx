import { useState, useRef, useEffect } from 'react';
import { ReactComponent as EyeDropperIcon } from './eye-dropper-solid.svg';
import useWindowSize from './hooks/window-size';
import './App.css';

export default function App() {
  const [picking, setPicking] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#000');
  const [image, setImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pickerRef = useRef<HTMLCanvasElement>(null);

  const [width, height] = useWindowSize();

  console.log(width, height);

  useEffect(() => {
    if (image && canvasRef.current) {
      const paddingRem = 4;
      const paddingPx = paddingRem * parseFloat(getComputedStyle(document.documentElement).fontSize);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
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

        if (context) {
          context.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        }
      };

      img.src = image;
    }
  }, [image, width, height]);

  return (
    <div className='App'>
      <div id='controls-container'>
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

      </div>

      <canvas id='image-canvas' ref={canvasRef} />

    </div>
  );
}

// export default App;
