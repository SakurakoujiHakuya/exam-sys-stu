import React from 'react';
import './index.css';

const PanThumb = ({
  image,
  zIndex = 1,
  width = '150px',
  height = '150px',
  children
}) => {
  const containerStyle = {
    zIndex,
    height,
    width
  };

  return (
    <div className="pan-item" style={containerStyle}>
      <div className="pan-info">
        <div className="pan-info-roles-container">
          {children}
        </div>
      </div>
      <img src={image} className="pan-thumb" alt="avatar" />
    </div>
  );
};

export default PanThumb;
