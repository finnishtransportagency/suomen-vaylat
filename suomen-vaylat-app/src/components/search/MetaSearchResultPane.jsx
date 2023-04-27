import strings from '../../translations';
import { StyledDropDown, StyledDropdownContentItem, StyledDropdownContentItemTitle, StyledHideSearchResultsButton } from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layer from '../menus/hierarchical-layerlist/Layer';
import {
    faAngleUp
} from '@fortawesome/free-solid-svg-icons';

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
        <StyledHideSearchResultsButton
            onClick={() => setShowSearchResults(false)}
        >
            <FontAwesomeIcon icon={faAngleUp} />
        </StyledHideSearchResultsButton>
    </StyledDropDown>
    );
};

export default MetaSearchResultPanel;