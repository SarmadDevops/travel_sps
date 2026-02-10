exports.handleSequelizeError = (error) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    const field = error.errors[0]?.path;
    return `${field} already exists`;
  }

  if (error.name === "SequelizeValidationError") {
    return error.errors[0]?.message;
  }

  return "Something went wrong";
};
