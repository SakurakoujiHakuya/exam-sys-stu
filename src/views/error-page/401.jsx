import React from 'react';
import { useNavigate } from 'react-router-dom';
import './401.css';

const Error401 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">401</h1>
        <p className="not-found-message">未授权访问...</p>
        <p className="not-found-info">您没有权限访问此页面，请登录后重试或返回首页。</p>
        <button onClick={handleGoHome} className="return-home-btn">
          返回首页
        </button>
      </div>
    </div>
  );
};

export default Error401;
