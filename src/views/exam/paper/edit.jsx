import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, message, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import examPaperAnswerApi from '../../../api/examPaperAnswer';
import QuestionAnswerShow from '../components/QuestionAnswerShow';
import './edit.css';

const { Title } = Typography;

const ExamPaperEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [answerData, setAnswerData] = useState(null);
  const [form] = useState({});

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('id');
    if (id) {
      loadAnswerData(id);
    }
  }, [location.search, loadAnswerData]);

  const loadAnswerData = async (id) => {
    setLoading(true);
    try {
      const result = await examPaperAnswerApi.read(id);
      if (result && result.code === 1) {
        setAnswerData(result.response);
      }
    } catch (error) {
      console.error('Failed to load answer data:', error);
      message.error('加载试卷数据失败');
      navigate('/record/index');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // 实现批改提交逻辑
    setLoading(true);
    try {
      const result = await examPaperAnswerApi.edit(form);
      if (result && result.code === 1) {
        message.success('批改完成');
        navigate('/record/index');
      } else {
        message.error(result.message || '批改失败');
      }
    } catch (error) {
      console.error('Failed to submit edit:', error);
      message.error('批改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-edit-container">
      <Card className="exam-edit-card" loading={loading}>
        {answerData && (
          <>
            <div className="exam-edit-header">
              <Title level={2}>试卷批改</Title>
              <div className="exam-edit-info">
                <p>试卷名称：{answerData.paperName}</p>
                <p>学生姓名：{answerData.userName}</p>
                <p>得分：{answerData.userScore}</p>
              </div>
            </div>
            <div className="exam-edit-content">
              {answerData.questionAnswerItems?.map((item) => (
                <Card key={item.questionId} className="exam-question-card">
                  <QuestionAnswerShow
                    qType={item.questionType}
                    question={item.question}
                    answer={item.answer}
                  />
                </Card>
              ))}
            </div>
            <div className="exam-edit-footer">
              <Button type="primary" onClick={handleSubmit} loading={loading} size="large">
                提交批改
              </Button>
              <Button onClick={() => navigate('/record/index')} size="large" style={{ marginLeft: '16px' }}>
                返回
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ExamPaperEdit;