import React, { useState, useEffect } from 'react';
import { Card, Collapse, Tag, Pagination, Spin, Empty } from 'antd';
import userApi from '../../api/user';
import useEnumStore from '../../store/enumStore';
import useUserStore from '../../store/userStore';
import './message.css';

const { Panel } = Collapse;

const UserMessage = () => {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queryParam, setQueryParam] = useState({
    pageIndex: 1,
    pageSize: 10
  });
  const { enumFormat, user } = useEnumStore();
  const { messageCountSubtract } = useUserStore();
  const readTag = user.message.readTag;
  const readText = user.message.readText;

  useEffect(() => {
    search();
  }, [search]);

  const search = async () => {
    setLoading(true);
    try {
      const result = await userApi.messagePageList(queryParam);
      if (result && result.code === 1) {
        const re = result.response;
        setTableData(re.list);
        setTotal(re.total);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (val) => {
    if (val === '') {
      return;
    }
    const selectItem = tableData.find(item => item.id === val);
    if (selectItem && !selectItem.readed) {
      try {
        await userApi.read(val);
        // 更新本地数据
        setTableData(prev => prev.map(item => 
          item.id === val ? { ...item, readed: true } : item
        ));
        // 更新消息计数
        messageCountSubtract(1);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
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

  const readTagFormat = (status) => {
    return enumFormat(readTag, status);
  };

  const readTextFormat = (status) => {
    return enumFormat(readText, status);
  };

  return (
    <div className="message-container">
      <Card className="message-card" shadow="hover">
        <Spin spinning={loading}>
          {total === 0 ? (
            <Empty description="暂无消息" />
          ) : (
            <>
              <Collapse
                accordion
                onChange={handleChange}
                className="message-collapse"
              >
                {tableData.map(item => (
                  <Panel
                    key={item.id}
                    header={
                      <div className="message-header">
                        <span className="message-title">{item.title}</span>
                        <Tag type={readTagFormat(item.readed)} className="message-tag">
                          {readTextFormat(item.readed)}
                        </Tag>
                      </div>
                    }
                  >
                    <div className="message-content">
                      <div className="message-item">
                        <span className="message-label">发送人：</span>
                        <span>{item.sendUserName}</span>
                      </div>
                      <div className="message-item">
                        <span className="message-label">发送时间：</span>
                        <span>{item.createTime}</span>
                      </div>
                      <div className="message-item">
                        <span className="message-label">发送内容：</span>
                        <span>{item.content}</span>
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
              <div className="pagination-container">
                <Pagination
                  current={queryParam.pageIndex}
                  pageSize={queryParam.pageSize}
                  total={total}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '50', '100']}
                  showTotal={(total) => `共 ${total} 条消息`}
                />
              </div>
            </>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default UserMessage;