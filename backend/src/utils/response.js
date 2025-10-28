// src/utils/response.js
function success(res, data = {}, code = 200) {
  return res.status(code).json({ success: true, ...data });
}

function failure(res, error, code = 500) {
  console.error(error);
  return res.status(code).json({ success: false, error: error.message || error });
}

module.exports = { success, failure };
