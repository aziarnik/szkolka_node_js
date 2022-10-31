import { createLogger } from 'bunyan';
import path from 'path';

const logger = createLogger({
  name: 'node_js_school',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
    {
      type: 'rotating-file',
      path: path.join(__dirname, '..', 'logs', 'node-school-js.log'),
      period: '1d',
      count: 10
    }
  ]
});

export default logger;
