import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationInfo } from '../../types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, total_pages } = pagination;
  
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(total_pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < total_pages - 1) {
      rangeWithDots.push('...', total_pages);
    } else if (total_pages > 1) {
      rangeWithDots.push(total_pages);
    }

    return rangeWithDots;
  };

  if (total_pages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <BootstrapPagination>
        <BootstrapPagination.Prev 
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </BootstrapPagination.Prev>
        
        {getVisiblePages().map((pageNum, index) => (
          <BootstrapPagination.Item
            key={index}
            active={pageNum === page}
            disabled={pageNum === '...'}
            onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
          >
            {pageNum}
          </BootstrapPagination.Item>
        ))}
        
        <BootstrapPagination.Next 
          disabled={page === total_pages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </BootstrapPagination.Next>
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;