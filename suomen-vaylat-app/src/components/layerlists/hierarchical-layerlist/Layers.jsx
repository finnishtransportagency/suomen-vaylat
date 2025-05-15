import Layer from './Layer';
import strings from '../../../translations';
import { findGroupForLayer } from './Layer';

export const Layers = ({
    layers,
    groups = [],
    themeName,
    isSelected
}) => {
    const currentLang = strings.getLanguage();

    return (
        <>
            {layers.map((layer, index) => {
                const groupObj = findGroupForLayer(groups, layer.id);
                const matchingGroup = groupObj ? groupObj.locale[currentLang].name : 'Unknown';
                return (
                    <Layer
                        key={layer.id + '_' + themeName}
                        layer={layer} 
                        groupName={matchingGroup}
                        index={index}
                        isSelected={isSelected}
                        themeName={themeName}
                    />
            )})}
        </>
    );
  };

export default Layers;