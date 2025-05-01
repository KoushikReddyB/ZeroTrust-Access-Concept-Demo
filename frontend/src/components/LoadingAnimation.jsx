import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="ztna-loader">
        <div className="shield">
          <div className="shield-inner">
            <div className="shield-wave"></div>
          </div>
        </div>
        <div className="pulse-rings">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>
      </div>
      <p className="loading-text">Securing Connection...</p>
    </div>
  );
};

export default LoadingAnimation;