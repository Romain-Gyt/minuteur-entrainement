import fs from 'fs';

const logger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.headers.origin}\n`;
  console.log(log.trim());
  try {
    fs.appendFileSync('server.log', log);
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyLog = `Body: ${JSON.stringify(req.body)}\n`;
      fs.appendFileSync('server.log', bodyLog);
      console.log(bodyLog.trim());
    }
  } catch (e) {
    console.error("Logging error:", e);
  }
  next();
};

export default logger;
