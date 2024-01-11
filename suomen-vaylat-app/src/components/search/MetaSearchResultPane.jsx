import strings from '../../translations';
import { StyledDropDown, StyledDropdownContentItem, StyledDropdownContentItemTitle } from './Search';
import Layer from '../menus/hierarchical-layerlist/Layer';

const MetaSearchResultPanel = ({
    searchResults,
    dropdownVariants,
    setShowSearchResults,
    allLayers
}) => {
    return (
        <StyledDropDown
        key={'dropdown-content-metadata'}
        variants={dropdownVariants}
        initial={'initial'}
        animate={'animate'}
        exit={'exit'}
        transition={'transition'}
    >
        {searchResults.length > 0 ? (
            searchResults.map((result) => {
                const layers = allLayers.filter(
                    (layer) =>
                        layer.metadataIdentifier ===
                        result.id
                );
                return layers.map((layer) => {
                    return (
                        <Layer
                            key={`metadata_${layer.id}`}
                            layer={layer}
                        />
                    );
                });
            })
        ) : (
            <StyledDropdownContentItem key={'no-results'}>
                <StyledDropdownContentItemTitle type="noResults">
                    {strings.search.metadata.error.text}
                </StyledDropdownContentItemTitle>
            </StyledDropdownContentItem>
        )}
    </StyledDropDown>
    );
};

export default MetaSearchResultPanel;