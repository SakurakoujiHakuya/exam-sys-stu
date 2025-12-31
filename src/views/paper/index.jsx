import React, { useState, useEffect } from 'react';
import { Tabs, Radio, Table, Button, Pagination, Card, Spin } from 'antd';
import { Link } from 'react-router-dom';
import examPaperApi from '../../api/examPaper';
import subjectApi from '../../api/subject';
import useEnumStore from '../../store/enumStore';
import './index.css';

const PaperIndex = () => {
  const { exam } = useEnumStore();
  const paperTypeEnum = exam.examPaper.paperTypeEnum;
  
  const [subjectList, setSubjectList] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState('');
  const [queryParam, setQueryParam] = useState({
    paperType: 1,
    subjectId: 0,
    pageIndex: 1,
    pageSize: 10
  });
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initSubject();
  }, [initSubject]);

  const initSubject = async () => {
    try {
      const result = await subjectApi.list();
      if (result && result.code === 1) {
        const subjects = result.response;
        setSubjectList(subjects);
        if (subjects.length > 0) {
          const subjectId = subjects[0].id;
          setActiveTabKey(subjectId.toString());
          setQueryParam(prev => ({
            ...prev,
            subjectId,
            pageIndex: 1
          }));
          search();
        }
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const search = async () => {
    setLoading(true);
    try {
      const result = await examPaperApi.pageList(queryParam);
      if (result && result.code === 1) {
        const re = result.response;
        setTableData(re.list);
        setTotal(re.total);
      }
    } catch (error) {
      console.error('Failed to load papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
    setQueryParam(prev => ({
      ...prev,
      subjectId: Number(key),
      pageIndex: 1
    }));
    search();
  };

  const handlePaperTypeChange = (e) => {
    setQueryParam(prev => ({
      ...prev,
      paperType: e.target.value,
      pageIndex: 1
    }));
    search();
  };

  const handlePaginationChange = (page, pageSize) => {
    setQueryParam(prev => ({
      ...prev,
      pageIndex: page,
      pageSize
    }));
    search();
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      align: 'center'
    },
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 200
    },
    {
      title: '题目数',
      dataIndex: 'questionCount',
      key: 'questionCount',
      width: 100,
      align: 'center'
    },
    {
      title: '总分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Link to={`/do?id=${record.id}`} target="_blank">
          <Button type="primary" size="small" shape="round">
            开始答题
          </Button>
        </Link>
      )
    }
  ];

  const tabItems = subjectList.map(item => ({
    key: item.id.toString(),
    label: item.name,
    children: (
      <>
        <div className="filter-bar">
          <Radio.Group
            value={queryParam.paperType}
            size="small"
            onChange={handlePaperTypeChange}
            buttonStyle="solid"
          >
            {paperTypeEnum.map(paperType => (
              <Radio.Button
                key={paperType.key}
                value={paperType.key}
              >
                {paperType.value}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={false}
            bordered
            className="paper-table"
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
            />
          </div>
        )}
      </>
    )
  }));

  return (
    <div className="paper-container">
      <Card shadow="never" className="paper-card">
        <Tabs
          activeKey={activeTabKey}
          onChange={handleTabChange}
          items={tabItems}
          className="paper-tabs"
          size="large"
        />
      </Card>
    </div>
  );
};

export default PaperIndex;