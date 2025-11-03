exports.index = (req, res) => {
  res.render("index", { title: "CSE 340 Starter", dbMsg: "Hello DB" });
};
