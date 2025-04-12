import React from 'react';
import { ToggleSwitchProps } from '@/types/profile';

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ defaultChecked = false, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className="switch">
      <input 
        type="checkbox" 
        defaultChecked={defaultChecked} 
        onChange={handleChange}
        data-testid="switch-input"
      />
      <span className="slider round"></span>
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #3B82F6;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #3B82F6;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </label>
  );
};

export default ToggleSwitch;
