export default class MarkerHandler {
    constructor(onClick) {
        this.onClick = onClick;
        this.visibleMarkers = [];
        this.currentMarker = 0;
    }
    init(channel) {
        console.log("test");
        channel.handleEvent('MapClickedEvent', ({lon, lat, x, y, ctrlKeyDown}) => {
            this.onClick({lon, lat});
        });
    }
    synchronize(channel, state) {
        console.log(channel);
        console.log("SOOOOS");
        if (this.visibleMarkers === state.markers) {
            return; // relying on immutability; same identity -> no changes
        }

        // add & update
        const visibleMarkers = new Map(this.visibleMarkers.map((marker) => [marker.id, marker]));
        state.markers
            .filter((marker) => {
                const visibleMarker = visibleMarkers.get(marker.id);
                if (!visibleMarker) { // new location id
                    return true;
                }
                return visibleMarker !== marker; // relying on immutability; changed identity -> update
            })
            .forEach((marker) => {
                const markerDef = {
                    x: marker.lon,
                    y: marker.lat,
                    color: '#910aa3',
                    shape: this.currentMarker, // icon number (0-6)
                    size: 3
                }
                channel.postRequest('MapModulePlugin.AddMarkerRequest', [markerDef, marker.id]);
                this.currentMarker++;
                if (this.currentMarker > 6) {
                    this.currentMarker = 0;
                }
            });

        // delete
        const newMarkers = new Map(state.markers.map((marker) => [marker.id, marker]));
        const toDelete = this.visibleMarkers.filter((marker) => !newMarkers.has(marker.id));
        toDelete.forEach((marker) => {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [marker.id]);
        });

        this.visibleMarkers = state.markers;
    }
}