import Layer from './Layer';
import { useAppSelector } from '../../../state/hooks';

export const Layers = ({ groupLayers, allLayers, isOpen }) => {
    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    var filteredLayers = [];
    if (groupLayers) {
        groupLayers.forEach((groupLayerId) => {
            var layer = allLayers.find(layer => layer.id === groupLayerId);
            layer !== undefined && filteredLayers.push(layer);
        });
    };
    return (
        <>
            {filteredLayers.map((layer, index) => {
                return (
                    <Layer key={layer.id} layer={layer} isOpen={isOpen} index={index}></Layer>
            )})}
        </>
    );
  };

export default Layers;