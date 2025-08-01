import { useState } from "react";

export const usePaginationSort = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  return {
    page,
    setPage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};
