export class Logger {
    logger: string;
    enabled: boolean;

    constructor(logger: string) {
        this.logger = logger;
        this.enabled = false;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        this.enabled = urlParams.has('debug');
    }

    log(message: string, ...args: any) {
        if (this.enabled && console && typeof console.log == 'function') {
            console.log(this.logger + ': ' + message, ...args)
        }
    }

    warn(message: string, ...args: any) {
        if (this.enabled && console && typeof console.warn == 'function') {
            console.warn(this.logger + ': ' + message, ...args)
        }
    }

    error(message: string, ...args: any) {
        if (this.enabled && console && typeof console.error == 'function') {
            console.error(this.logger + ': ' + message, ...args)
        }
    }
}