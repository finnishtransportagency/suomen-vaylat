import Layer from './Layer';

export const Layers = ({ groupLayers, allLayers }) => {
    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    var filteredLayers = [];
    if (groupLayers) {
        groupLayers.forEach((groupLayerList) => {
            filteredLayers.push(allLayers.filter(layer => layer.id === groupLayerList));
        });
    }
    return (
        <>
            {filteredLayers.map((layer, index) => {
                return (
                    <Layer key={index} layer={layer}></Layer>
            )})}
        </>
    );
  };

export default Layers;