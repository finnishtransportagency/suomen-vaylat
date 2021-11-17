export default class MarkerHandler {
    constructor(onClick) {
        this.onClick = onClick;
    }
    init(channel) {
        channel.handleEvent('DataForMapLocationEvent', ({x, y, content, layerId, type}) => {
            this.onClick({x, y, content, layerId, type});
        });
    }
    synchronize(channel, state) {
    }
}