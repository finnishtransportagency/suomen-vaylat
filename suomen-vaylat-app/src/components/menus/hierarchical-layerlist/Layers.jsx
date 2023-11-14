import Layer from './Layer';
import strings from '../../../translations';
import { findGroupForLayer } from './Layer';
import { theme } from '../../../theme/theme';

export const Layers = ({
    layers,
    groups = [],
    themeName,
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
                        key={layer.id + '_' + themeName}
                        layer={layer} 
                        isOpen={isOpen}
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