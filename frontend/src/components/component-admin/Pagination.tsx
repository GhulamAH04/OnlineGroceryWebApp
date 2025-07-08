interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:font-bold"
      >
        Previous
      </button>
      <span>
        {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:font-bold"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
