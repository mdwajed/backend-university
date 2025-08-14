export type TPaginationOptions = {
  page?: number;
  limit?: number;
};

export type TPaginationResult = {
  page: number;
  limit: number;
  skip: number;
};
export const calculatePagination = (
  options: TPaginationOptions
): TPaginationResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};
export default calculatePagination;
