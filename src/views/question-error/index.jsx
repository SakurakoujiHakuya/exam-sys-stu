import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Row, Col, Pagination, Skeleton } from 'antd';
import questionAnswerApi from '../../api/questionAnswer';
import useEnumStore from '../../store/enumStore';
import QuestionAnswerShow from '../exam/components/QuestionAnswerShow';
import './index.css';

const QuestionErrorIndex = () => {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qAnswerLoading, setQAnswerLoading] = useState(false);
  const [selectItem, setSelectItem] = useState({
    questionType: 0,
    questionItem: null,
    answerItem: null
  });
  const [queryParam, setQueryParam] = useState({
    pageIndex: 1,
    pageSize: 10
  });
  const { enumFormat, exam } = useEnumStore();
  const questionTypeEnum = exam.question.typeEnum;

  useEffect(() => {
    search();
  }, [search]);

  const search = async () => {
    setLoading(true);
    try {
      const result = await questionAnswerApi.pageList(queryParam);
      if (result && result.code === 1) {
        const re = result.response;
        setTableData(re.list);
        setTotal(re.total);
        if (re.list.length > 0) {
          qAnswerShow(re.list[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load question errors:', error);
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

  const itemSelect = (record) => {
    qAnswerShow(record.id);
  };

  const qAnswerShow = async (id) => {
    setQAnswerLoading(true);
    try {
      const result = await questionAnswerApi.select(id);
      if (result && result.code === 1) {
        const response = result.response;
        setSelectItem({
          questionType: response.questionVM.questionType,
          questionItem: response.questionVM,
          answerItem: response.questionAnswerVM
        });
      }
    } catch (error) {
      console.error('Failed to load question details:', error);
    } finally {
      setQAnswerLoading(false);
    }
  };

  const questionTypeFormatter = (questionType) => {
    return enumFormat(questionTypeEnum, questionType);
  };

  const columns = [
    {
      title: '题干',
      dataIndex: 'shortTitle',
      key: 'shortTitle',
      minWidth: 200,
      ellipsis: true
    },
    {
      title: '题型',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 100,
      align: 'center',
      render: (questionType) => (
        <Tag size="small">{questionTypeFormatter(questionType)}</Tag>
      )
    },
    {
      title: '学科',
      dataIndex: 'subjectName',
      key: 'subjectName',
      width: 100,
      align: 'center'
    },
    {
      title: '做题时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      align: 'center'
    }
  ];

  return (
    <div className="question-error-container">
      <Card className="main-card" shadow="none">
        <div className="card-header">
          <span>我的错题本</span>
        </div>
        <Row gutter={30}>
          <Col xs={24} lg={14}>
            <Table
              loading={loading}
              dataSource={tableData}
              columns={columns}
              rowKey="id"
              pagination={false}
              className="question-table"
              onRow={(record) => ({
                onClick: () => itemSelect(record),
                style: {
                  cursor: 'pointer',
                  backgroundColor: selectItem.questionItem?.id === record.questionId ? '#f5f7fa' : 'transparent'
                }
              })}
            />
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
          </Col>
          <Col xs={24} lg={10}>
            <Card className="detail-card" shadow="none">
              <div className="card-header">
                <span>题目详情与解析</span>
              </div>
              {qAnswerLoading ? (
                <Skeleton rows={10} animated />
              ) : (
                <QuestionAnswerShow
                  qType={selectItem.questionType}
                  question={selectItem.questionItem}
                  answer={selectItem.answerItem}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QuestionErrorIndex;