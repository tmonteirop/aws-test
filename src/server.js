import log from 'npmlog';
import app from './app.js';

log.enableColor();

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    log.info('LOG', `${process.env.APP_NAME} - PORT: ${port}`);
});
