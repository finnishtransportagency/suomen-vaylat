import Layer from './Layer';
import strings from '../../../translations';
import { findGroupForLayer } from './Layer';
import { theme } from '../../../theme/theme';

export const Layers = ({
    layers,
    groups = [],
    isOpen,
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
                        key={layer.id + '_' + theme}
                        layer={layer} 
                        isOpen={isOpen}
                        groupName={matchingGroup}
                        index={index}
                        isSelected={isSelected}
                    />
            )})}
        </>
    );
  };

export default Layers;