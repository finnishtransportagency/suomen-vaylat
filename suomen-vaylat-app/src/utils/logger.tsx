export class Logger {
    logger: string;

    constructor(logger: string) {
        this.logger = logger;
    }

    log(message: string) {
        if (console && typeof console.log == 'function') {
            console.log(this.logger + ': ' + message)
        }
    }

    warn(message: string) {
        if (console && typeof console.warn == 'function') {
            console.warn(this.logger + ': ' + message)
        }
    }

    error(message: string) {
        if (console && typeof console.error == 'function') {
            console.error(this.logger + ': ' + message)
        }
    }
}