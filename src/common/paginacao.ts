// src/common/utils/paginate.ts
interface PaginateOptions {
  page: number;
  limit: number;
}

export function getPaginationParams({ page, limit }: PaginateOptions) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  };
}
