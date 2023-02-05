
const { APP_PORT } = require("./config/config.default");
const app = require('./app')

app.listen(APP_PORT, () => {
  console.log(`running on http://localhost:${APP_PORT}`);
});
