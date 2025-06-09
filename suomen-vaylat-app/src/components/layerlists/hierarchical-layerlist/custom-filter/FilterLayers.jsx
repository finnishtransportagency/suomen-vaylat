import FilterLayer from './FilterLayer';
import strings from '../../../../translations';
import { findGroupForLayer } from './FilterLayer';

export const FilterLayers = ({
    layers,
    groups = [],
    theme,
}) => {
    const currentLang = strings.getLanguage();

    return (
        <>
            {layers.map((layer, index) => {
                const groupObj = findGroupForLayer(groups, layer.id);
                const matchingGroup = groupObj ? groupObj.locale[currentLang].name : 'Unknown';
                return (
                    <FilterLayer
                        key={layer.id + '_' + theme}
                        layer={layer} 
                        groupName={matchingGroup}
                        index={index}
                        theme={theme}
                    />
            )})}
        </>
    );
  };

export default FilterLayers;