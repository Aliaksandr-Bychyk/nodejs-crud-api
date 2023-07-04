import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import Database from './Database';
import http from 'node:http';
import single from './single';

const multi = (initPort: string, database: Database) => {
  if (cluster.isPrimary) {
    const parallelism = availableParallelism() - 1;
    for (let i = 1; i <= parallelism; i++) {
      const port = (+initPort + i).toString();
      cluster.fork({ PARALLELISM_PORT: port });
    }

    let currentPort = initPort;
    const loadBalancer = http.createServer((req, res) => {
      try {
        currentPort = portPicker(currentPort, parallelism);
        const request = http.request(
          { hostname: 'localhost', port: currentPort, path: req.url, method: req.method },
          (resp) => {
            resp.pipe(res);
          },
        );
        req.pipe(request);
        console.log(`Request send to localhost:${currentPort}`);
      } catch (error) {
        res.statusCode = 500;
        res.end(`ERROR: ${(error as Error).message}`);
      }
    });

    loadBalancer.listen(initPort, () => {
      console.info(`Load Balancer running at http://localhost:${initPort}`);
    });
  } else {
    single(process.env.PARALLELISM_PORT || '3001', database);
  }
};

const portPicker = (currentPort: string, parallelismCount: number) => {
  const port = +currentPort;
  return (port + 1 === 3000 + parallelismCount + 1 ? 3001 : port + 1).toString();
};

export default multi;
