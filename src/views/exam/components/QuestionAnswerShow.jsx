import React from 'react';
import { Radio, Checkbox, Input, Tag, Rate } from 'antd';
import useEnumStore from '../../../store/enumStore';
import './QuestionAnswerShow.css';

const { TextArea } = Input;

const QuestionAnswerShow = ({ qType, question, answer }) => {
  const { enumFormat, exam } = useEnumStore();
  const doRightEnum = exam.question.answer.doRightEnum;
  const doRightTag = exam.question.answer.doRightTag;

  if (!question) {
    return <div className="no-question">请选择一道题目查看详情</div>;
  }

  const doRightTagFormatter = (status) => {
    return enumFormat(doRightTag, status);
  };

  const doRightTextFormatter = (status) => {
    return enumFormat(doRightEnum, status);
  };

  const trueFalseFormatter = (question) => {
    const correctItem = question.items.find(item => item.prefix === question.correct);
    return correctItem ? correctItem.content : '';
  };

  const renderQuestion = () => {
    switch (qType) {
      case 1: // 单选题
        return (
          <div>
            <div className="q-title" dangerouslySetInnerHTML={{ __html: question.title }} />
            <div className="q-content">
              <Radio.Group value={answer.content} disabled>
                {question.items?.map(item => (
                  <Radio key={item.prefix} value={item.prefix}>
                    <span className="question-prefix">{item.prefix}.</span>
                    <span className="q-item-span-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        );
      case 2: // 多选题
        return (
          <div>
            <div className="q-title" dangerouslySetInnerHTML={{ __html: question.title }} />
            <div className="q-content">
              <Checkbox.Group value={answer.contentArray} disabled>
                {question.items?.map(item => (
                  <Checkbox key={item.prefix} value={item.prefix}>
                    <span className="question-prefix">{item.prefix}.</span>
                    <span className="q-item-span-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </div>
          </div>
        );
      case 3: // 判断题
        return (
          <div>
            <span className="q-title" dangerouslySetInnerHTML={{ __html: question.title }} />
            <span style={{ paddingRight: '10px' }}>(</span>
            <Radio.Group value={answer.content} disabled>
              {question.items?.map(item => (
                <Radio key={item.prefix} value={item.prefix}>
                  <span className="q-item-span-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                </Radio>
              ))}
            </Radio.Group>
            <span style={{ paddingLeft: '10px' }}>)</span>
          </div>
        );
      case 4: // 填空题
        return (
          <div>
            <div className="q-title" dangerouslySetInnerHTML={{ __html: question.title }} />
            <div className="q-content">
              {question.items?.map(item => (
                <div key={item.prefix} className="fill-blank-item">
                  <span className="question-prefix">{item.prefix}.</span>
                  <Input
                    value={answer.contentArray?.[item.prefix - 1] || ''}
                    disabled
                    className="fill-blank-input"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 5: // 简答题
        return (
          <div>
            <div className="q-title" dangerouslySetInnerHTML={{ __html: question.title }} />
            <div className="q-content">
              <TextArea
                value={answer.content || ''}
                disabled
                rows={5}
                className="short-answer-input"
              />
            </div>
          </div>
        );
      default:
        return <div>未知题型</div>;
    }
  };

  return (
    <div className="question-answer-show">
      {renderQuestion()}
      <div className="question-info">
        <div className="question-answer-show-item">
          <span className="question-show-item">结果：</span>
          <Tag type={doRightTagFormatter(answer.doRight)}>
            {doRightTextFormatter(answer.doRight)}
          </Tag>
        </div>
        <div className="question-answer-show-item">
          <span className="question-show-item">分数：</span>
          <span>{question.score}</span>
        </div>
        <div className="question-answer-show-item">
          <span className="question-show-item">难度：</span>
          <Rate disabled value={question.difficult} className="question-show-item" />
        </div>
        <div className="question-answer-show-item">
          <span className="question-show-item">解析：</span>
          <span className="q-item-span-content" dangerouslySetInnerHTML={{ __html: question.analyze }} />
        </div>
        <div className="question-answer-show-item">
          <span className="question-show-item">正确答案：</span>
          {qType === 1 || qType === 2 || qType === 5 ? (
            <span className="q-item-span-content" dangerouslySetInnerHTML={{ __html: question.correct }} />
          ) : qType === 3 ? (
            <span className="q-item-span-content" dangerouslySetInnerHTML={{ __html: trueFalseFormatter(question) }} />
          ) : qType === 4 ? (
            <span>{question.correctArray}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswerShow;