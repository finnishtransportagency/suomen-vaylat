export default class MarkerHandler {
    constructor(onClick) {
        this.onClick = onClick;
    }
    init(channel) {
        channel.handleEvent('DataForMapLocationEvent', ({x, y, content, layerId, type}) => {
            console.log(x);
            console.log(y);
            console.log(layerId);
            console.log(type);
            this.onClick({x, y, content, layerId, type});
        });
    }
    synchronize(channel, state) {
    }
}