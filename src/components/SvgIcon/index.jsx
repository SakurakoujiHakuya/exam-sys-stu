import React from 'react';
import { isExternal } from '../utils/validate';

const SvgIcon = ({ iconClass, className, ...rest }) => {
  const isExternalIcon = isExternal(iconClass);
  
  if (isExternalIcon) {
    return (
      <div
        style={{
          mask: `url(${iconClass}) no-repeat 50% 50%`,
          WebkitMask: `url(${iconClass}) no-repeat 50% 50%`,
          backgroundColor: 'currentColor',
          maskSize: 'cover !important',
          display: 'inline-block',
          width: '1em',
          height: '1em',
          verticalAlign: '-0.15em',
          overflow: 'hidden'
        }}
        className={`svg-external-icon svg-icon ${className}`}
        {...rest}
      />
    );
  }
  
  return (
    <svg
      className={`svg-icon ${className}`}
      aria-hidden="true"
      {...rest}
    >
      <use xlinkHref={`#icon-${iconClass}`} />
    </svg>
  );
};

export default SvgIcon;