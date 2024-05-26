import { FunctionComponent, ChangeEvent } from 'react';
import { ReactComponent as EyeDropperIcon } from '../assets/eye-dropper-solid.svg';
import { rgbaToHex } from '../utils';

const Controls: FunctionComponent<{
  picking: boolean;
  color: string;
  handleEyeDropperClick: () => void;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({
  picking,
  color,
  handleEyeDropperClick,
  handleImageUpload,
}) => {
    return (
      <div id='controls-container'>
        <button id='toggle-button'
          className={`${picking ? 'toggle-button-active' : ''}`}
          onClick={handleEyeDropperClick} >
          <EyeDropperIcon style={{
            height: '1rem',
            width: '1rem',
          }} />
        </button>

        <span><strong>{rgbaToHex(color)}</strong></span>

        <input id='image-upload'
          type='file'
          onChange={handleImageUpload} />
      </div>
    )
  };

export default Controls;
