import app from "./app";
import config from "./config";
import { initDB } from "./db";

const port = config.port || 5000;

const main = () => {
  initDB();
  app.listen(port, () => {
    console.log(`DevPulse server is running at http://localhost:${port}`);
  });
};

main();
