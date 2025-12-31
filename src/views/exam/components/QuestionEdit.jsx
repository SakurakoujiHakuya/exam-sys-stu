import React, { useState } from 'react';
import { Radio, Checkbox, Input } from 'antd';
import './QuestionEdit.css';

const { TextArea } = Input;

const QuestionEdit = ({ qType, question, answer }) => {
  // 使用本地状态管理答案，而不是直接修改props
  const [localAnswer, setLocalAnswer] = useState({
    content: answer.content,
    contentArray: answer.contentArray || [],
    completed: answer.completed
  });

  

  const renderQuestion = () => {
    switch (qType) {
      case 1: // 单选题
        return (
          <div>
            <div className="q-title" dangerouslySetInnerHTML={{ __html: question.title }} />
            <div className="q-content">
              <Radio.Group
                value={localAnswer.content}
                onChange={(e) => {
                  setLocalAnswer(prev => ({
                    ...prev,
                    content: e.target.value,
                    completed: true
                  }));
                }}
              >
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
              <Checkbox.Group
                value={localAnswer.contentArray}
                onChange={(values) => {
                  setLocalAnswer(prev => ({
                    ...prev,
                    contentArray: values,
                    completed: true
                  }));
                }}
              >
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
            <Radio.Group
              value={localAnswer.content}
              onChange={(e) => {
                setLocalAnswer(prev => ({
                  ...prev,
                  content: e.target.value,
                  completed: true
                }));
              }}
            >
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
                    value={localAnswer.contentArray?.[item.prefix - 1] || ''}
                    onChange={(e) => {
                      setLocalAnswer(prev => {
                        const newContentArray = [...(prev.contentArray || [])];
                        newContentArray[item.prefix - 1] = e.target.value;
                        return {
                          ...prev,
                          contentArray: newContentArray,
                          completed: true
                        };
                      });
                    }}
                    className="fill-blank-input"
                    placeholder="请输入答案"
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
                value={localAnswer.content || ''}
                onChange={(e) => {
                  setLocalAnswer(prev => ({
                    ...prev,
                    content: e.target.value,
                    completed: true
                  }));
                }}
                rows={5}
                placeholder="请输入答案"
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
    <div className="question-edit">
      {renderQuestion()}
    </div>
  );
};

export default QuestionEdit;