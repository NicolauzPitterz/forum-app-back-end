require('dotenv').config();
const { createServer, container } = require('./Infrastructures');

(async () => {
  const server = await createServer(container);
  await server.start();
  // eslint-disable-next-line no-console
  console.log(`server start at ${server.info.uri}`);
})();
