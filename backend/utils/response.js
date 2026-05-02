const sendSuccess = (res, data, message = "Success") =>
  res.json({
    success: true,
    data,
    message,
  });

const sendError = (res, status, message, data) => {
  const payload = {
    success: false,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(status).json(payload);
};

module.exports = { sendSuccess, sendError };
