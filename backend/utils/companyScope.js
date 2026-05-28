const getCompanyId = (req) =>
  req.user?.companyId || req.headers["x-company-id"] || null;

const applyCompanyFilter = (req, filter = {}) => {
  const companyId = getCompanyId(req);
  return companyId ? { ...filter, company: companyId } : filter;
};

module.exports = {
  getCompanyId,
  applyCompanyFilter,
};
