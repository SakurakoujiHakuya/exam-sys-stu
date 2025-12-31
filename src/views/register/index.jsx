import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import registerApi from '../../api/register';
import useEnumStore from '../../store/enumStore';
import './index.css';

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useEnumStore();
  const levelEnum = user.levelEnum;

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const result = await registerApi.register(values);
      if (result && result.code === 1) {
        message.success('注册成功');
        navigate('/login');
      } else {
        message.error(result.message || '注册失败');
      }
    } catch {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-box">
          <div className="register-header">
            <div className="register-logo">
              {/* 使用Ant Design的Logo或自定义Logo */}
            </div>
            <h2 className="register-title">考试系统</h2>
          </div>
          <Form
            form={form}
            name="register"
            initialValues={{ userLevel: 1 }}
            onFinish={handleRegister}
            className="register-form"
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
                className="register-input"
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
                autoComplete="new-password"
                className="register-input"
              />
            </Form.Item>
            <Form.Item
              name="userLevel"
              rules={[{ required: true, message: '请选择年级!' }]}
            >
              <Select
                placeholder="年级"
                className="register-select"
                options={levelEnum.map(item => ({
                  value: item.key,
                  label: item.value
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="register-button"
                block
              >
                注册
              </Button>
            </Form.Item>
            <div className="register-footer">
              <span>已有账号?</span>
              <Link to="/login" className="login-link">
                登录
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;