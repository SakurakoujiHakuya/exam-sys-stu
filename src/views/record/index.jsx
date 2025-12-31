import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Pagination, Divider, Avatar, Spin } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import examPaperAnswerApi from '../../api/examPaperAnswer';
import useEnumStore from '../../store/enumStore';
import './index.css';

const RecordIndex = () => {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectItem, setSelectItem] = useState({
    systemScore: '0',
    userScore: '0',
    paperScore: '0',
    questionCorrect: 0,
    questionCount: 0,
    doTime: '0'
  });
  const [queryParam, setQueryParam] = useState({
    pageIndex: 1,
    pageSize: 10
  });
  const { enumFormat, exam } = useEnumStore();
  const statusEnum = exam.examPaperAnswer.statusEnum;
  const statusTag = exam.examPaperAnswer.statusTag;

  useEffect(() => {
    search();
  }, [search]);

  const search = async () => {
    setLoading(true);
    try {
      const result = await examPaperAnswerApi.pageList(queryParam);
      if (result && result.code === 1) {
        const re = result.response;
        setTableData(re.list);
        setTotal(re.total);
        if (re.list.length > 0 && !selectItem.id) {
          setSelectItem(re.list[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setQueryParam(prev => ({
      ...prev,
      pageIndex: page,
      pageSize
    }));
    search();
  };

  const handleRowClick = (record) => {
    setSelectItem(record);
  };

  const statusTagFormatter = (status) => {
    return enumFormat(statusTag, status);
  };

  const statusTextFormatter = (status) => {
    return enumFormat(statusEnum, status);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'paperName',
      key: 'paperName',
      minWidth: 120
    },
    {
      title: '学科',
      dataIndex: 'subjectName',
      key: 'subjectName',
      width: 80,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center',
      render: (status) => (
        <Tag type={statusTagFormatter(status)} effect="plain">
          {statusTextFormatter(status)}
        </Tag>
      )
    },
    {
      title: '做题时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <Link to={`/edit?id=${record.id}`} target="_blank">
              <Button type="primary" size="small" shape="round">
                批改
              </Button>
            </Link>
          );
        } else if (record.status === 2) {
          return (
            <Link to={`/read?id=${record.id}`} target="_blank">
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
    <div className="record-container">
      <div className="record-layout">
        <Card
          className="info-card"
          hoverable
        >
          <div className="info-header">
            <Avatar
              icon={<UserOutlined />}
              size="large"
              className="info-avatar"
            />
            <div className="info-title">答题统计</div>
          </div>
          <Divider />
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">系统判分</span>
              <span className="info-value">{selectItem.systemScore}</span>
            </div>
            <div className="info-item">
              <span className="info-label">最终得分</span>
              <span className="info-value highlight">{selectItem.userScore}</span>
            </div>
            <div className="info-item">
              <span className="info-label">试卷总分</span>
              <span className="info-value">{selectItem.paperScore}</span>
            </div>
            <div className="info-item">
              <span className="info-label">正确题数</span>
              <span className="info-value">{selectItem.questionCorrect}</span>
            </div>
            <div className="info-item">
              <span className="info-label">总题数</span>
              <span className="info-value">{selectItem.questionCount}</span>
            </div>
            <div className="info-item">
              <span className="info-label">用时</span>
              <span className="info-value">{selectItem.doTime}</span>
            </div>
          </div>
        </Card>

        <Card
          className="table-card"
          hoverable
        >
          <div className="table-title">
            <Avatar
              icon={<FileTextOutlined />}
              size="medium"
              className="table-avatar"
            />
            <span>我的答题记录</span>
          </div>
          <Divider />
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey="id"
              pagination={false}
              bordered
              className="record-table"
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: {
                  cursor: 'pointer',
                  backgroundColor: selectItem.id === record.id ? '#e6f7ff' : 'transparent'
                }
              })}
            />
          </Spin>
          {total > 0 && (
            <div className="pagination-container">
              <Pagination
                current={queryParam.pageIndex}
                pageSize={queryParam.pageSize}
                total={total}
                onChange={handlePaginationChange}
                showSizeChanger
                pageSizeOptions={['10', '20', '50', '100']}
                showTotal={(total) => `共 ${total} 条记录`}
                background
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecordIndex;