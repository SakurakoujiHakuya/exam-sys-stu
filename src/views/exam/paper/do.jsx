import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Tag, Button, Spin, message, Modal, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';
import examPaperApi from '../../../api/examPaper';
import examPaperAnswerApi from '../../../api/examPaperAnswer';
import useEnumStore from '../../../store/enumStore';
import { formatSeconds } from '../../../utils';
import QuestionEdit from '../components/QuestionEdit';
import './do.css';

const { Title } = Typography;

const ExamPaperDo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(true);
  const [form, setForm] = useState({});
  const [answer, setAnswer] = useState({
    questionId: null,
    doTime: 0,
    answerItems: []
  });
  const [remainTime, setRemainTime] = useState(0);
  const timerRef = useRef(null);
  const { enumFormat, exam } = useEnumStore();
  const doCompletedTag = exam.question.answer.doCompletedTag;

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('id');
    if (id) {
      loadExamPaper(id);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [location.search, loadExamPaper]);

  const loadExamPaper = async (id) => {
    setFormLoading(true);
    try {
      const result = await examPaperApi.select(id);
      if (result && result.code === 1) {
        const paperData = result.response;
        setForm(paperData);
        setRemainTime(paperData.suggestTime * 60);
        initAnswer(paperData);
        startTimer();
      }
    } catch (error) {
      console.error('Failed to load exam paper:', error);
      message.error('加载试卷失败');
      navigate('/paper/index');
    } finally {
      setFormLoading(false);
    }
  };

  const initAnswer = (paperData) => {
    const answerItems = [];
    paperData.titleItems?.forEach(titleItem => {
      titleItem.questionItems?.forEach(question => {
        answerItems.push({
          questionId: question.id,
          content: null,
          contentArray: [],
          completed: false,
          itemOrder: question.itemOrder
        });
      });
    });
    setAnswer(prev => ({
      ...prev,
      id: paperData.id,
      answerItems
    }));
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRemainTime(prev => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          submitForm();
          return 0;
        }
        setAnswer(prevAnswer => ({
          ...prevAnswer,
          doTime: prevAnswer.doTime + 1
        }));
        return prev - 1;
      });
    }, 1000);
  };

  const questionCompleted = (completed) => {
    return enumFormat(doCompletedTag, completed);
  };

  const goAnchor = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const submitForm = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setFormLoading(true);
    try {
      const result = await examPaperAnswerApi.answerSubmit(answer);
      if (result && result.code === 1) {
        Modal.success({
          title: '考试结果',
          content: `试卷得分：${result.response}分`,
          okText: '返回考试记录',
          onOk: () => {
            navigate('/record/index');
          }
        });
      } else {
        message.error(result.message || '提交失败');
      }
    } catch (error) {
      console.error('Failed to submit exam:', error);
      message.error('提交失败，请重试');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="exam-do-container">
      <div className="do-exam-title">
        {answer.answerItems.map(item => (
          <Tag
            key={item.itemOrder}
            type={questionCompleted(item.completed)}
            className="do-exam-title-tag"
            onClick={() => goAnchor(`#question-${item.itemOrder}`)}
          >
            {item.itemOrder}
          </Tag>
        ))}
        <div className="do-exam-time">
          <ClockCircleOutlined />
          <span>{formatSeconds(remainTime)}</span>
        </div>
      </div>

      <Card className="exam-paper-card" loading={formLoading}>
        <div className="exam-paper-header">
          <Title level={2}>{form.name}</Title>
          <div className="exam-paper-info">
            <span className="exam-paper-info-item">试卷总分：{form.score}</span>
            <span className="exam-paper-info-item">考试时间：{form.suggestTime}分钟</span>
          </div>
        </div>

        <div className="exam-paper-content">
          {form.titleItems?.map((titleItem, index) => (
            <div key={index} className="exam-section">
              <Title level={4}>{titleItem.name}</Title>
              {titleItem.questionItems?.map(questionItem => (
                <Card key={questionItem.id} className="exam-question-card">
                  <div id={`question-${questionItem.itemOrder}`} className="exam-question-header">
                    <span className="exam-question-number">{questionItem.itemOrder}.</span>
                  </div>
                  <QuestionEdit
                    qType={questionItem.questionType}
                    question={questionItem}
                    answer={answer.answerItems[questionItem.itemOrder - 1]}
                  />
                </Card>
              ))}
            </div>
          ))}
        </div>

        <div className="exam-paper-footer">
          <Button type="primary" onClick={submitForm} loading={formLoading} size="large">
            提交试卷
          </Button>
          <Button onClick={() => navigate('/paper/index')} size="large" style={{ marginLeft: '16px' }}>
            取消
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExamPaperDo;