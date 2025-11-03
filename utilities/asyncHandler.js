// Why: tiny wrapper to avoid try/catch in every controller
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
