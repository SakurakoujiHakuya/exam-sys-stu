import React, { useState, useEffect } from 'react';
import { Card, Upload, Avatar, Tabs, Timeline, Form, Input, Select, DatePicker, Button, Divider, Spin, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import userApi from '../../api/user';
import useEnumStore from '../../store/enumStore';
import './index.css';

const { TabPane } = Tabs;
const { Option } = Select;

const UserInfo = () => {
  const [form] = Form.useForm();
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { enumFormat, user } = useEnumStore();
  const sexEnum = user.sexEnum;
  const levelEnum = user.levelEnum;

  useEffect(() => {
    loadUserData();
    loadUserEvents();
  }, [loadUserData, loadUserEvents]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const result = await userApi.getCurrentUser();
      if (result && result.code === 1) {
        form.setFieldsValue(result.response);
      }
    } catch {
      console.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const loadUserEvents = async () => {
    try {
      const result = await userApi.getUserEvent();
      if (result && result.code === 1) {
        setEvent(result.response);
      }
    } catch {
      console.error('Failed to load user events');
    }
  };

  const uploadSuccess = (re) => {
    if (re.code === 1) {
      message.success('头像上传成功');
      window.location.reload();
    } else {
      message.error(re.message);
    }
  };

  const handleUpdate = async (values) => {
    setFormLoading(true);
    try {
      const result = await userApi.update(values);
      if (result && result.code === 1) {
        message.success(result.message);
      } else {
        message.error(result.message);
      }
    } catch {
      message.error('更新失败，请重试');
    } finally {
      setFormLoading(false);
    }
  };

  const levelFormatter = (level) => {
    return enumFormat(levelEnum, level);
  };

  return (
    <div className="user-info-container">
      {/* 个人信息 */}
      <div className="profile-row">
        <Card className="user-profile-card">
          <div className="card-header">
            <span>个人信息</span>
          </div>
          <Spin spinning={loading}>
            <div className="user-profile-content">
              <Upload
                action="/api/student/upload/image"
                accept=".jpg,.png"
                showUploadList={false}
                onSuccess={uploadSuccess}
              >
                <Avatar
                  size={120}
                  src={form.getFieldValue('imagePath')}
                  icon={<UserOutlined />}
                  className="user-avatar"
                />
              </Upload>
              <h2 className="user-name">{form.getFieldValue('userName')}</h2>
              <div className="user-details">
                <span>姓名：{form.getFieldValue('realName')}</span>
                <Divider type="vertical" />
                <span>年级：{levelFormatter(form.getFieldValue('userLevel'))}</span>
                <Divider type="vertical" />
                <span>注册时间：{form.getFieldValue('createTime')}</span>
              </div>
            </div>
          </Spin>
        </Card>
      </div>

      {/* 用户动态和资料修改 */}
      <div className="activity-row">
        <Card className="user-activity-card" hoverable>
          <Tabs defaultActiveKey="event" type="card">
            <Tabs.TabPane tab="用户动态" key="event">
              <Timeline>
                {event.map(item => (
                  <Timeline.Item key={item.id} timestamp={item.createTime}>
                    <Card className="event-card">
                      <p>{item.content}</p>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Tabs.TabPane>
            <Tabs.TabPane tab="个人资料修改" key="update">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                initialValues={{}}
                className="user-form"
              >
                <Spin spinning={formLoading}>
                  <Form.Item
                    name="realName"
                    label="真实姓名"
                    rules={[{ required: true, message: '请输入真实姓名!' }]}
                  >
                    <Input placeholder="请输入真实姓名" />
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label="年龄"
                  >
                    <Input type="number" placeholder="请输入年龄" />
                  </Form.Item>
                  <Form.Item
                    name="sex"
                    label="性别"
                  >
                    <Select placeholder="请选择性别">
                      {sexEnum.map(item => (
                        <Option key={item.key} value={item.key}>{item.value}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="birthDay"
                    label="出生日期"
                  >
                    <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="手机"
                  >
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                  <Form.Item
                    name="userLevel"
                    label="年级"
                    rules={[{ required: true, message: '请选择年级!' }]}
                  >
                    <Select placeholder="请选择年级">
                      {levelEnum.map(item => (
                        <Option key={item.key} value={item.key}>{item.value}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={formLoading}>
                      更新
                    </Button>
                  </Form.Item>
                </Spin>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default UserInfo;