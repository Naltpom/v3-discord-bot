const { createLogger, format, transports } = require('winston');
const path = require('path');
const appRoot = path.dirname(require.main.filename);

class Logger {
    static log(level, message, dest, data = {}, context = {time: new Date().toUTCString()}) {
        const logger = createLogger({
            level: level,
            exitOnError: false,
            format: format.json(),
            transports: [
                new transports.File({filename: `${appRoot}/var/log/${dest}.log`}),
            ],
        });

        logger.log(level, message, {context, data});
    }
}

module.exports = Logger;