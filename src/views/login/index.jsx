import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message, Badge } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import loginApi from '../../api/login';
import useUserStore from '../../store/userStore';
import './index.css';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [capsTooltip, setCapsTooltip] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { setUserName } = useUserStore();

  useEffect(() => {
    // 初始化时聚焦用户名输入框
    form.setFieldsValue({ userName: '' });
  }, [form]);

  const checkCapslock = (e) => {
    const { shiftKey, key } = e;
    if (key && key.length === 1) {
      if (
        (shiftKey && key >= 'a' && key <= 'z') ||
        (!shiftKey && key >= 'A' && key <= 'Z')
      ) {
        setCapsTooltip(true);
      } else {
        setCapsTooltip(false);
      }
    }
    if (key === 'CapsLock') {
      setCapsTooltip(!capsTooltip);
    }
  };

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const result = await loginApi.login(values);
      if (result && result.code === 1) {
        setUserName(values.userName);
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(result.message || '登录失败');
      }
    } catch {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-header">
            <div className="login-logo">
              {/* 使用Ant Design的Logo或自定义Logo */}
            </div>
            <h2 className="login-title">考试系统</h2>
          </div>
          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            className="login-form"
          >
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 5, message: '用户名不能少于5个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
                className="login-input"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 5, message: '密码不能少于5个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
                className="login-input"
                iconRender={(visible) => (
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                )}
                onKeyUp={checkCapslock}
                onBlur={() => setCapsTooltip(false)}
                ref={passwordRef}
              />
              {capsTooltip && (
                <div className="caps-lock-tip">
                  <Badge status="warning" text="大写锁定已打开" />
                </div>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
              >
                登录
              </Button>
            </Form.Item>
            <div className="login-footer">
              <span>还没有账号?</span>
              <Link to="/register" className="register-link">
                注册
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;