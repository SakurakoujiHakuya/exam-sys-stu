import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import dashboardApi from '../../api/dashboard';
import useEnumStore from '../../store/enumStore';
import './index.css';

const Dashboard = () => {
  const [fixedPaper, setFixedPaper] = useState([]);
  const [timeLimitPaper, setTimeLimitPaper] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const { enumFormat, exam } = useEnumStore();
  const statusEnum = exam.examPaperAnswer.statusEnum;
  const statusTag = exam.examPaperAnswer.statusTag;

  useEffect(() => {
    loadDashboardData();
    loadTaskData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await dashboardApi.index();
      if (result && result.code === 1) {
        setFixedPaper(result.response.fixedPaper);
        setTimeLimitPaper(result.response.timeLimitPaper);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTaskData = async () => {
    setTaskLoading(true);
    try {
      const result = await dashboardApi.task();
      if (result && result.code === 1) {
        setTaskList(result.response);
      }
    } catch (error) {
      console.error('Failed to load task data:', error);
    } finally {
      setTaskLoading(false);
    }
  };

  const flatTaskList = () => {
    const flatList = [];
    taskList.forEach(task => {
      if (task.paperItems) {
        task.paperItems.forEach(paper => {
          flatList.push({
            taskTitle: task.title,
            ...paper
          });
        });
      }
    });
    return flatList;
  };

  const statusTagFormatter = (status) => {
    return enumFormat(statusTag, status);
  };

  const statusTextFormatter = (status) => {
    return enumFormat(statusEnum, status);
  };

  const taskColumns = [
    {
      title: '任务标题',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      minWidth: 180
    },
    {
      title: '试卷名称',
      dataIndex: 'examPaperName',
      key: 'examPaperName',
      minWidth: 200
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        if (status !== null) {
          return (
            <Tag type={statusTagFormatter(status)} size="small" effect="plain">
              {statusTextFormatter(status)}
            </Tag>
          );
        }
        return (
          <Tag size="small" effect="plain" color="blue">
            未开始
          </Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => {
        if (record.status === null) {
          return (
            <Link to={`/do?id=${record.examPaperId}`} target="_blank">
              <Button type="primary" size="small" shape="round">
                开始答题
              </Button>
            </Link>
          );
        } else if (record.status === 1) {
          return (
            <Link to={`/edit?id=${record.examPaperAnswerId}`} target="_blank">
              <Button type="warning" size="small" shape="round">
                批改试卷
              </Button>
            </Link>
          );
        } else if (record.status === 2) {
          return (
            <Link to={`/read?id=${record.examPaperAnswerId}`} target="_blank">
              <Button type="success" size="small" shape="round">
                查看试卷
              </Button>
            </Link>
          );
        }
        return null;
      }
    }
  ];

  return (
    <div style={{ margin: '10px 0' }}>
      <div className="app-item-contain">
        <h3 className="index-title-h3 task-title">任务中心</h3>
        <div style={{ paddingLeft: '15px' }}>
          <Spin spinning={taskLoading}>
            <Table
              columns={taskColumns}
              dataSource={flatTaskList()}
              rowKey="examPaperId"
              className="task-table"
              pagination={false}
              bordered
              stripe
            />
          </Spin>
        </div>
      </div>

      <div className="app-item-contain">
        <h3 className="index-title-h3">固定试卷</h3>
        <div style={{ paddingLeft: '15px' }}>
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {fixedPaper.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    bodyStyle={{ padding: '0px' }}
                    className="paper-card"
                  >
                    <img
                      src="https://via.placeholder.com/120x80?text=Fixed+Paper"
                      alt={item.name}
                      className="paper-image"
                    />
                    <div className="paper-info">
                      <span className="paper-name">{item.name}</span>
                      <div className="bottom clearfix">
                        <Link to={`/do?id=${item.id}`} target="_blank">
                          <Button type="link" className="action-button">
                            开始做题
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        </div>
      </div>

      <div className="app-item-contain">
        <h3 className="index-title-h3 time-limit-title">时段试卷</h3>
        <div style={{ paddingLeft: '15px' }}>
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {timeLimitPaper.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    bodyStyle={{ padding: '0px' }}
                    className="paper-card"
                  >
                    <img
                      src="https://via.placeholder.com/120x80?text=Time+Limit+Paper"
                      alt={item.name}
                      className="paper-image"
                    />
                    <div className="paper-info">
                      <span className="paper-name">{item.name}</span>
                      <div className="time-limit-info">
                        <span>{item.startTime}</span>
                        <br />
                        <span>{item.endTime}</span>
                      </div>
                      <div className="bottom clearfix">
                        <Link to={`/do?id=${item.id}`} target="_blank">
                          <Button type="link" className="action-button">
                            开始做题
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;