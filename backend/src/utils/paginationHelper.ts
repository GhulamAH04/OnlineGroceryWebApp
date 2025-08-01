// backend/src/utils/paginationHelper.ts

export const parsePaginationQuery = (
  query: any,
  defaultSortBy = "createdAt"
) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const sortBy = query.sortBy || defaultSortBy;
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder: sortOrder as "asc" | "desc",
  };
};
