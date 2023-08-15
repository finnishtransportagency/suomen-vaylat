import Layer from './Layer';
import strings from '../../../translations';

export const Layers = ({
    layers,
    groups = [],
    isOpen,
    theme,
    isSelected = false
}) => {
    const currentLang = strings.getLanguage();

    const findGroupNameOfLayer = (groups, layerId) => {
        for (let group of groups) {
    
            if (group.layers && group.layers.includes(layerId)) {
                return group;
            }
    
            if (group.groups) {
                const nestedGroup = findGroupNameOfLayer(group.groups, layerId);
                if (nestedGroup) {
                    return nestedGroup;
                }
            }
        }
        return null;
    };

    return (
        <>
            {layers.map((layer, index) => {
                const groupObj = findGroupNameOfLayer(groups, layer.id);

                const matchingGroup = groupObj ? groupObj.locale[currentLang].name : 'Unknown';
                return (
                    <Layer
                        key={layer.id + '_' + theme}
                        layer={layer} 
                        isOpen={isOpen}
                        groupName={matchingGroup}
                        index={index}
                        theme={theme}
                        isSelected={isSelected}
                    />
            )})}
        </>
    );
  };

export default Layers;