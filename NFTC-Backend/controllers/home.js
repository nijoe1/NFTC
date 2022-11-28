const path = require("path");
const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../pages/collections.html`));
};
module.exports = {
  getHome: home
};