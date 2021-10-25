const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();
const assert = require("assert");
let _ig;

const login = async () => {
  try {
    // _ig = true;
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    _ig = ig;
  } catch (err) {
    console.log(err);
  }
};

const getIg = () => {
  assert.ok(_ig, "You are not loggedin to instagram");
  return _ig;
};

module.exports = {
  login,
  getIg,
};
