export default class RequestTags {
    constructor() {
        this.groups = this.getAllGroups();
        this.layers = this.getAllLayers();
    }

    getLayersByGroup (group) {
        var filteredGroups = group.filter(function (el) {
            return el.name == group ;
          });
        return filteredGroups;
    }

    /**
    * Search VKM road
    * @method @private searchVKMRoad
    * @param  {Integer} tie tie id, required
    * @param  {Integer} tieosa tieosa id
    * @param  {Integer} ajorata ajorata id
    * @param  {Integer} etaisyys etaisyys
    * @return {Boolean} 
    */
    searchVKMRoad (tie, tieosa, ajorata, etaisyys) {
        // Tehdään VKM tiehaku searchVKMRoad funktiolla
        channel.searchVKMRoad([tie, tieosa, ajorata, etaisyys], function (data) {
            channel.log('Tiehaku onnistui', data);
            // Korostetaan löytynyt geometria kartalta
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [data.geom, { "centerTo": true }]);
        }, function(errors) { channel.log('Tiehaku epäonnistui', errors); } );
    }

    /**
    * Get all layers
    * @method @private getAllLayers
    * @return {JSONArray} return array of layer
    */
    getAllLayers () {
        channel.getAllLayers(function (layers) {
            return layers;
        });
    }

    /**
    * Get all groups
    * @method @private getAllGroups
    * @return {JSONArray} return array of groups with layers,
    */
    getAllGroups () {
        channel.getAllGroups(function (groups) {
            return groups;
        });
    }

    /**
    * Get all tags
    * @method @private getAllTags
    * @return {JSONArray} return array of tags, empty if no tags
    */
    getAllTags () {
        channel.getAllTags(function (tags) {
            return tags;
        });
    }

    /**
    * Get all tags of layer
    * @method @private getLayerTags
    * @param  {Integer} layerId layerId id, required
    * @return {JSONArray} return array of tags, empty JSONArray if no tags
    */
    getLayerTags (layerId) {
        channel.getLayerTags([layerId], function (tags) {
            return tags;
        });
    }

    /**
    * Get all layers of a tag
    * @method @private getTagLayers
    * @param  {String} tag tag, required
    * @return {JSONArray} return array of layers, empty JSONArray if no layers
    */
    getTagLayers (tag) {
        channel.getTagLayers([tag], function (layers) {
            return layers;
        });
    }
}
