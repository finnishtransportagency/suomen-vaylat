import styled from 'styled-components';
import strings from '../../translations';
import { StyledDropDown, StyledDropdownContentItem, StyledSearchIcon, StyledDropdownContentItemTitle, StyledHideSearchResultsButton } from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import {
    faAngleUp,
    faCity,
    faRoad,
    faTrain,
} from '@fortawesome/free-solid-svg-icons';


const AddRessSearchResultPanel = ({
    searchResults,
    dropdownVariants,
    firstSearchResultShown,
    handleSearchSelect,
    setFirstSearchResultShown,
    isMobile,
    setShowSearchResults,
    setSearchClickedRow,
    searchClickedRow,
}) => {

    return (
        <StyledDropDown
        key={'dropdown-content-address'}
        variants={dropdownVariants}
        initial={'initial'}
        animate={'animate'}
        exit={'exit'}
        transition={'transition'}
    >
        {

        searchResults.result &&
        searchResults.result.locations &&
        searchResults.result.locations.length > 0 ? (
            searchResults.result.locations.map(
                (
                    { name, region, type, lon, lat, vkmType, geom, osa, ajorata, etaisyys, osa_loppu, etaisyys_loppu },
                    index
                ) => {
                    let visibleText;
                    if (name === region) {
                        visibleText = name;
                        if (type) {
                            visibleText +=
                                ' (' + type.toLowerCase() + ')';
                        }
                    } else if (region && type) {
                        visibleText =
                            name +
                            ', ' +
                            region +
                            ' (' +
                            type.toLowerCase() +
                            ')';
                    } else if (type) {
                        visibleText =
                            name +
                            ' (' +
                            type.toLowerCase() +
                            ')';
                    } else {
                        visibleText = name;
                    }

                    // Show result on the map if search returns only one result
                    if (searchResults.result.locations.length === 1 && !firstSearchResultShown) {
                        handleSearchSelect(
                            name,
                            lon,
                            lat,
                            geom,
                            osa,
                            ajorata,
                            etaisyys,
                            osa_loppu,
                            etaisyys_loppu,
                            vkmType
                        );
                        setFirstSearchResultShown(true);
                        toast.dismiss('searchToast');
                    }

                    return (
                        <StyledDropdownContentItem
                            key={name + '_' + index}
                            type={'searchResult'}
                            onClick={() => {
                                handleSearchSelect(
                                    name,
                                    lon,
                                    lat,
                                    geom,
                                    osa,
                                    ajorata,
                                    etaisyys,
                                    osa_loppu,
                                    etaisyys_loppu,
                                    vkmType
                                );
                                isMobile &&
                                    setShowSearchResults(false);
                                setSearchClickedRow(index);
                            }}
                        >
                            <StyledSearchIcon active={searchClickedRow === index || searchResults.result.locations.length === 1}>
                                <FontAwesomeIcon
                                    icon={vkmType && vkmType === 'road' ? faRoad : (vkmType && vkmType === 'track') ? faTrain: faCity}
                                />
                            </StyledSearchIcon>
                            <StyledDropdownContentItemTitle type={'searchResult'} active={searchClickedRow === index || searchResults.result.locations.length === 1}>
                                {visibleText}
                            </StyledDropdownContentItemTitle>
                        </StyledDropdownContentItem>
                    );
                }
            )
        ) : ( <div> {strings.search.address.error.text}</div> 
            /*<StyledDropdownContentItem key={'no-results'}>
                <StyledDropdownContentItemTitle type="noResults">
                    {strings.search.address.error.text}
                </StyledDropdownContentItemTitle>
            </StyledDropdownContentItem>
            */
        )}
        <StyledHideSearchResultsButton
            onClick={() => setShowSearchResults(false)}
        >
            <FontAwesomeIcon icon={faAngleUp} />
        </StyledHideSearchResultsButton>
    </StyledDropDown>
    );
};

export default AddRessSearchResultPanel;