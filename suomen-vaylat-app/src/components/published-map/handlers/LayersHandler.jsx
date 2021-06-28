export default class GroupsHandler {
    constructor(layersGetted) {
        this.layersGetted = layersGetted;
        this.selectedLayers = [];
    }

    init(channel) {
        channel.getSupportedFunctions((data) => {
            if (data.getAllLayers === true) {
                channel.getAllLayers((layers) => {
                    this.layersGetted(layers);
                });
            }
        });
    }

    synchronize(channel, state) {/*
        if (this.selectedLayers === state.selectedLayers) {
            return; // relying on immutability; same identity -> no changes
        }
        const selectedLayers = new Map(this.selectedLayers.map((layer) => [layer]));
        state.selectedLayers
            .filter((layer) => {
                const selectLayer = selectedLayers.get(layer.id);
                if (!selectLayer) { // new location id
                    return true;
                }
                return selectLayer !== layer; // relying on immutability; changed identity -> update
            })
            .forEach((layer) => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            });

            const newSelectedLayers = new Map(state.selectedLayers.map((layer) => [layer]));
            const toDelete = this.selectedLayers.filter((layer) => !newSelectedLayers.has(layer.id));
            toDelete.forEach((layer) => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            });
    
            this.selectedLayers = state.selectedLayers;*/
        //channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, !currentVisibility]);
    }
}