import React from 'react';
import { Pagination as AntPagination } from 'antd';
import { scrollTo } from '@/utils/scroll-to';
import './index.css';

const Pagination = ({
  total,
  page = 1,
  limit = 10,
  pageSizes = [5, 10, 20, 30, 50],
  layout = 'prev, pager, next',
  showSizeChanger = false,
  autoScroll = true,
  hidden = false,
  onPagination
}) => {
  const handlePageChange = (newPage, newPageSize) => {
    if (onPagination) {
      onPagination({ page: newPage, limit: newPageSize });
    }
    if (autoScroll) {
      scrollTo(0, 800);
    }
  };

  const handleSizeChange = (current, newSize) => {
    if (onPagination) {
      onPagination({ page: current, limit: newSize });
    }
    if (autoScroll) {
      scrollTo(0, 800);
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="pagination-container">
      <AntPagination
        current={page}
        pageSize={limit}
        total={total}
        showSizeChanger={showSizeChanger}
        pageSizeOptions={pageSizes}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange}
        showQuickJumper={layout.includes('jumper')}
        showTotal={(total) => layout.includes('total') ? `共 ${total} 条` : null}
      />
    </div>
  );
};

export default Pagination;
