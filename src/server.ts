import app from "./app";
import config from "./config";

const port = config.port || 5000;

app.listen(port, () => {
  console.log(`DevPulse server is running at http://localhost:${config.port}`);
});
