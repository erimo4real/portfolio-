export function applyPagination(query, opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(opts.pageSize) || 1000));
  return query.skip((page - 1) * pageSize).limit(pageSize);
}
