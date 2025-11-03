// Why: keep route logic out of server/routes
exports.index = (req, res) => {
  // Pass a friendly title; DB work stays in models later
  res.render('index', { title: 'CSE 340 Starter', dbMsg: 'Hello DB' })
}
