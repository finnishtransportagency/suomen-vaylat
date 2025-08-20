import strings from '../../../translations';
import {
  StyledDropDown,
  StyledDropdownContentItem,
  StyledDropdownContentItemTitle
} from '../Search';
import Layer from '../../layer/Layer';
import { dropdownVariants } from '../utils/SearchUtil';
import { useAppSelector } from '../../../state/hooks';

const MetadataSearchResultPanel = () => {
  const { searchResults, allLayers } = useAppSelector((state) => state.rpc);

  return (
    <StyledDropDown
      key="dropdown-content-metadata"
      role="listbox"
      variants={dropdownVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition="transition"
    >
      {searchResults?.results?.length > 0 ? (
        searchResults.results.map((result, i) => {
          const layers = allLayers.filter(
            (layer) => layer.metadataIdentifier === result.id
          );
          return layers.map((layer) => {
            const optionId = `metadata-results-${layer.id}`;
            const labelId = `${optionId}-label`;

            return (
              <Layer
                key={optionId}
                id={optionId}
                role="option"
                aria-labelledby={labelId}
                layer={layer}
              />
            );
          });
        })
      ) : (
        <StyledDropdownContentItem
          key="metadata-results-no-results"
          id="metadata-results-no-results"
          role="status"
          aria-live="polite"
        >
          <StyledDropdownContentItemTitle
            id="metadata-results-no-results-label"
            type="noResults"
          >
            {strings.search.metadata.error.text}
          </StyledDropdownContentItemTitle>
        </StyledDropdownContentItem>
      )}
    </StyledDropDown>
  );
};

export default MetadataSearchResultPanel;
