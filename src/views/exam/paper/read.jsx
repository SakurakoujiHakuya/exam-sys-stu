import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, message, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import examPaperAnswerApi from '../../../api/examPaperAnswer';
import QuestionAnswerShow from '../components/QuestionAnswerShow';
import './read.css';

const { Title } = Typography;

const ExamPaperRead = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [answerData, setAnswerData] = useState(null);

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

  return (
    <div className="exam-read-container">
      <Card className="exam-read-card" loading={loading}>
        {answerData && (
          <>
            <div className="exam-read-header">
              <Title level={2}>试卷查看</Title>
              <div className="exam-read-info">
                <p>试卷名称：{answerData.paperName}</p>
                <p>学生姓名：{answerData.userName}</p>
                <p>得分：{answerData.userScore}</p>
                <p>总分：{answerData.paperScore}</p>
                <p>考试时间：{answerData.createTime}</p>
              </div>
            </div>
            <div className="exam-read-content">
              {answerData.questionAnswerItems?.map((item, index) => (
                <Card key={item.questionId} className="exam-question-card">
                  <div className="question-number">第 {index + 1} 题</div>
                  <QuestionAnswerShow
                    qType={item.questionType}
                    question={item.question}
                    answer={item.answer}
                  />
                </Card>
              ))}
            </div>
            <div className="exam-read-footer">
              <Button onClick={() => navigate('/record/index')} size="large">
                返回考试记录
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ExamPaperRead;