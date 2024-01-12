import strings from '../../translations';
import { StyledDropDown, StyledDropdownContentItem, StyledSearchIcon, StyledDropdownContentItemTitle } from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import {
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
    showOnlyType,
    activeSwitch
}) => {
    const typeResolvTable = [  ['address', 'Osoite'],
                               ['premise', 'Kiinteistötunnus'] ,
                               ['track', 'VKM'] ]
    const typeMap = new Map(typeResolvTable);
    const nonNomenclatureTypes = Array.from(typeMap.values());              
    let filteredResult = searchResults;
    if ( searchResults.result &&
        searchResults.result.locations &&
        searchResults.result.locations.length > 0){
            filteredResult =  searchResults.result.locations.filter(res => { 
                if  (showOnlyType === 'all' && activeSwitch === undefined){
                    return true;
                }
                let showResult = false;
                switch (showOnlyType){
                    case "track":
                        showResult = res.type === "VKM" && res.vkmType === "track";
                        break;
                    case "address":
                        showResult = res.type === typeMap.get(showOnlyType)
                        break;
                    case "premise":
                        showResult = res.type === typeMap.get(showOnlyType)
                        break;                        
                    case "road":
                        showResult = res.type === "VKM" && res.vkmType === "road";
                        break;
                    case "nomenclature":
                        showResult = res.channelId === 'NLSFI_GEOCODING' 
                        && !nonNomenclatureTypes.includes(res.type)
                        break;        
                    default:
                        return false;
                }   
                return showResult;
            });
        }
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
        filteredResult.length > 0 ? (
            filteredResult.map(
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
        ) 
        : 
        ( 
            <div> 
            {showOnlyType === 'track' ? strings.search.vkm.trackError.text : strings.search.address.error.text}
            </div> 
        )}
    </StyledDropDown>
    );
};

export default AddRessSearchResultPanel;