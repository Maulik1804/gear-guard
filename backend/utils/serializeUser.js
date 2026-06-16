const serializeUser = (userDoc) => {
  if (!userDoc) return null;

  const user =
    typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };

  delete user.password;

  return {
    ...user,
    id: user.id || user._id,
    company_id: user.company_id || user.companyId || user.company?._id || user.company || null,
  };
};

module.exports = {
  serializeUser,
};