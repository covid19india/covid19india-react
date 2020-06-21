import {PRIMARY_COLORS, BACKGROUND_COLORS} from '../constants';

import {CheckCircleIcon} from '@primer/octicons-v2-react';
import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--background-color)',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
  },
};

const ThemeChooser = ({
  isOpen,
  onClose,
  pColor,
  bgColor,
  onPColorChange,
  onBgColorChange,
}) => {
  console.log(isOpen);
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <div className="theme-chooser-modal">
        <h2 className="title">Customise you view</h2>
        <div className="color-chooser">
          <span className="title">Colors</span>
          <div className="colors">
            {PRIMARY_COLORS.map((color, idx) => (
              <div
                className="circle"
                key={idx}
                onClick={() => onPColorChange(color)}
                style={{background: color}}
              >
                {pColor === color && (
                  <CheckCircleIcon size={24} className="checked-icon" />
                )}
              </div>
            ))}
          </div>
          <div className="color-chooser">
            <span className="title">Background</span>
            <div className="colors">
              {Object.keys(BACKGROUND_COLORS).map((colorKey, idx) => {
                const {color, name} = BACKGROUND_COLORS[colorKey];
                const isDefault = color === BACKGROUND_COLORS.DEFAULT.color;
                const isSelected = color === bgColor;

                console.warn(color, isDefault);
                return (
                  <div
                    className="circle outlined"
                    key={idx}
                    onClick={() => onBgColorChange(color)}
                    style={{
                      background: color,
                      border: isSelected
                        ? '1px solid var(--primary-color)'
                        : '',
                    }}
                  >
                    {isSelected && (
                      <CheckCircleIcon
                        size={24}
                        className="checked-icon selected"
                      />
                    )}
                    <span
                      className={`bg-color-name ${isDefault ? 'light' : ''}`}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <span className="done-btn" onClick={onClose}>
          Done
        </span>
      </div>
    </Modal>
  );
};

export default ThemeChooser;
