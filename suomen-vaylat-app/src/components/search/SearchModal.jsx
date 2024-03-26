import styled from 'styled-components';
import strings from '../../translations';
import { ReactReduxContext } from 'react-redux';
import { setActiveSwitch } from '../../state/slices/uiSlice';
import { useAppSelector } from '../../state/hooks';
import { useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from '../switch/Switch';
import {
    faLongArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import SearchResultPanel from './SearchResultPanel';
import { resetFeatureSearchResults } from '../../state/slices/rpcSlice';


const StyledSearchModal = styled.div`
    border: none;
    width: 100%;
    padding-left: 28px;
    &:focus {
        outline: none;
    };
    position: absolute;
    top: 50px;
    background-color: white;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 6px 6px;
    padding-top: 10px;
    font-size: 15px;
    font-weight: 400;
    padding-top: 30px;
    z-index: -10;
    max-height: ${(props) => props.isMobile ? window.innerHeight-50 + "px": window.innerHeight-200 + "px"};
    padding-bottom: 16px;
    overflow: auto;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 5px;
    border-radius: 15px;
    border-color: #A0A0A0;
    margin-top: 3px;
    margin-bottom: 3px;
    
`;
const StyledInputHalf = styled.input`
    width: 49%;
    font-size: 16px;
    border-radius: 15px;
    border-color: #A0A0A0;
    margin-top: 3px;
    margin-bottom: 3px;
    padding: 5px;
    :last-of-type {
        margin-left: 2%;
    }
`;

const StyledSearchSection = styled.div`
    width: 90%;
    margin-bottom: 1em;
`;


const StyledLinkText = styled.a`
    margin-bottom: 10px;
`;

const VerticalAlign = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledCheckbox = styled.input`
    #margin-right: 7px;
    float: right;
    margin-top: 8px;
    margin-left: 10px;
    width: 16px;
    height: 16px;
    margin-top: 1px;
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 15px;
`;

const CheckboxLabel = styled.label`
    font-size: 16px;
    margin-top: 5px;
    color: grey;
`

const getSearchValuePart = (searchValue, searchType, part, carriageWaySearch) => {
    const splittedSearchArray = splitSearchValue(searchValue, searchType, part);
    let retVa;
    let actualPart;
    //actual value tells from which cell value is fetched
    //differenct cell of value array choosed if ajorata search not enabled 
    if (carriageWaySearch === true) {
        if (splittedSearchArray && part > splittedSearchArray.length){
            return ""
        }else {
            actualPart = part;
        }
    } else {
        //no ajorata part on etäisyys search
        if (part === 2 || part ===6){
            return ""
        }
        else if (part > 6) {
            actualPart = part - 2;
        } else if ( part >= 3) {
            actualPart = part - 1;
        } else {
            actualPart = part;
        }
    }  
    if(splittedSearchArray !== undefined && (splittedSearchArray.length -1) >= actualPart
        && typeof splittedSearchArray[actualPart] !== 'undefined') {
        retVa= splittedSearchArray[ actualPart];       
    }
    //first value set whole searchvalue
    else if (part === 0){
         retVa = searchValue; 
    } 
    else {
        retVa = "";
    }
    return retVa;
}

/**
 * Split search value string to single values
 * @param {*} searchValue search query string
 * @param {*} searchType type
 * @returns array containing search values
 */
const splitSearchValue = (searchValue, searchType) => {
    let roadParts;
    if (searchValue!== "" && searchType !== undefined &&
        searchType === 'address' && searchValue.includes("/")){
        //if roadsearch contains space, ingnore and handle on search field, range search case
        if (searchValue.includes(' ')){
            const partsArray = searchValue.split(" ");
            const part1 = partsArray[0].split("/").filter((val) => val !=="")
            const part2 = partsArray[1].split("/").filter((val) => val !=="")
            roadParts = part1.concat(part2)
        }else {
            roadParts =  searchValue.split("/");
        }            
    }
    return roadParts;
}

/**
 * update searchValue attribute
 * @param {*} searchValue whole search query 
 * @param {*} searchType 
 * @param {*} part part of roadsearch to update 0=tie, 1=osa, 2= ajorata, 3= etäisyys 
 * @param {*} value value to add
 */
const updateRoadSearchValue = (searchValue, searchType, setSearchValue, part, value, carriageWaySearch=false) => {
    //const oldPart = getSearchValuePart(searchValue, searchType, part);
    let searchArray = splitSearchValue(searchValue, searchType);
    const effectivePart = carriageWaySearch ? part : part -1
    if ((searchArray!==undefined && searchArray!=="") && searchArray.length >= effectivePart){
        //replace existing value
        //empty value in the middle remove values on right side
        if (value === ""){
            searchArray.length=part
        }
        const blancSpacePosition = carriageWaySearch ? 4 : 3
        if (part > blancSpacePosition){
            searchArray[effectivePart] = value;
        }else {
            searchArray[part] = value;
        }
        //range search add empty space between parts
        const updatedSearchValue= parseSearchValueFromParts(searchArray, blancSpacePosition)
        if (updatedSearchValue!==undefined){
            setSearchValue(updatedSearchValue);
        }
    } else if ((searchArray===undefined || searchArray==="") && value !== undefined && part === 0) {
        //first part
        setSearchValue(value);
    } else if ((searchArray===undefined || searchArray==="") && searchValue !== undefined && part === 1) {
        //add second part to search
        setSearchValue(searchValue + "/" + value);
    } else if ((searchArray!==undefined && searchArray!=="") && searchArray.length === (part -1)) {
        //any bigger new part than 0 or 1
        setSearchValue(searchValue + "/" + value);
    } 
}

/**
 * Parse value from value array
 * @param {*} partsArray array containing searchvalues
 * @param {*} blancSpacePosition position of space 3|4
 * @returns string searchvalue string on oskari vkm api undertandable format
 */
const parseSearchValueFromParts = (partsArray, blancSpacePosition) => {
    let newSearchValue;
    //if range search (more than blancSpacePosition params) add space between
    if (partsArray !== undefined && partsArray.length > (blancSpacePosition -1)){ 
        let firstPart = partsArray.slice(0, blancSpacePosition).join('/')
        let secondi = partsArray.slice(blancSpacePosition).join('/')
        newSearchValue = [firstPart, ' ',secondi].join('') ;
    }else {
        newSearchValue = partsArray.join('/');
    }
    return newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue;;
}

const SearchModal = ({
    searchValue,
    setSearchValue,
    searchResults,
    setSearchResults,
    dropdownVariants,
    firstSearchResultShown,
    handleSearchSelect,
    setFirstSearchResultShown,
    isMobile,
    setShowSearchResults,
    setSearchClickedRow,
    searchClickedRow,
    allLayers,
    isSearchOpen,
    showSearchResults,
    searchType,
    setSearchType,
    handleSeach,
    isOpen,
    toggleModal,
    carriageWaySearch, 
    setCarriageWaySearch,
}) => {
    const { store } = useContext(ReactReduxContext);
    const { activeSwitch } = useAppSelector((state) => state.ui);

    const updateActiveSwitch = (type) => {
        // if no specific search is selected, default to address
        if (activeSwitch !== type) {
            store.dispatch(setActiveSwitch(type))
            if(type === 'layer')
            setSearchType('metadata');
            else if (type === 'feature')
            setSearchType('feature');
            else
            setSearchType('address');
        } else {
            store.dispatch(setActiveSwitch(null));
            setSearchType('address');
        }
        setSearchResults(null);
        setShowSearchResults(false);
        setSearchValue('');
        store.dispatch(resetFeatureSearchResults());
      };
 
    useEffect(() => {
       setSearchValue(searchValue)
    }, [searchValue, setSearchValue]);  

    return isOpen ? (
        <StyledSearchModal>   
            <StyledLinkText rel="noreferrer" 
                target=""
                id = "addressLink" 
                href="#" 
                onClick={toggleModal }> 
            </StyledLinkText>
            <div style= {{clear: "both"}} />
            <>
                {
                    <Switch 
                    action={() => {
                        updateActiveSwitch('road')
                    }}
                    isSelected={activeSwitch==='road'}
                    title={strings.search.vkm.title}
                    tooltipText={strings.search.tips.vkmRoadExamples}
                    tooltipAddress={strings.search.tips.vkmRoad}
                    id={"vkm"}
                    tooltipEnabled={activeSwitch === 'road'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'road' &&  (
                <>
                <StyledSearchSection>   

                    <CheckboxWrapper> 
                            <CheckboxLabel>{strings.search.carriageWaySearch}</CheckboxLabel>
                            <StyledCheckbox
                                name='carriageWaySearchBox'
                                type='checkbox'
                                onChange={() => (setCarriageWaySearch(!carriageWaySearch))}
                                checked={carriageWaySearch}
                            />
                    </CheckboxWrapper> 
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.tie }
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 0, e.target.value, carriageWaySearch) }
                        value={getSearchValuePart(searchValue, searchType, 0)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <div>
                    <StyledInputHalf
                        type="text"
                        placeholder={ strings.search.vkm.osa }
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 1, e.target.value, carriageWaySearch) }
                        value={getSearchValuePart(searchValue, searchType, 1)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <StyledInputHalf
                        type="text"
                        placeholder={ strings.search.vkm.ajorata}
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 2, e.target.value, carriageWaySearch) }
                        value={getSearchValuePart(searchValue, searchType, 2, carriageWaySearch )}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                        disabled={!carriageWaySearch}
                    />
                    </div>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.etaisyys }
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, carriageWaySearch ? 3 : 2, e.target.value, carriageWaySearch) }
                        value={getSearchValuePart(searchValue, searchType, 3, carriageWaySearch)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <div className="clearboth" style= {{clear: "left"}} />
                    <VerticalAlign>
                    <FontAwesomeIcon    
                            icon={faLongArrowDown}
                            style={{
                            float: 'right',
                            marginRight: '16px',
                            color: 'blue', 
                            marginBottom: '10px',
                            }}
                            size='lg'  
                        />
                    </VerticalAlign>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.tieloppu }
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 4, e.target.value, carriageWaySearch) }
                        value={getSearchValuePart(searchValue, searchType, 4, carriageWaySearch)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <div>
                    <StyledInputHalf
                        type="text"
                        placeholder={ strings.search.vkm.osaLoppu }
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 5, e.target.value, carriageWaySearch) }
                        value={getSearchValuePart(searchValue, searchType, 5, carriageWaySearch)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <StyledInputHalf
                        type="text"
                        placeholder={ strings.search.vkm.ajorata}
                        value={getSearchValuePart(searchValue, searchType, 6, carriageWaySearch)}
                        onChange={(e) =>  updateRoadSearchValue(searchValue, searchType, setSearchValue, 6, e.target.value, carriageWaySearch)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                        disabled={!carriageWaySearch}
                    />
                    </div>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.etaisyysLoppu }
                        value={ getSearchValuePart(searchValue, searchType, 7, carriageWaySearch)}
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, carriageWaySearch ? 7 : 6, e.target.value, carriageWaySearch) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <div className="clearboth" style= {{clear: "left"}} />
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                        activeSwitch={activeSwitch}
                    />        

                </StyledSearchSection>  
                </>
                )
                }
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch==='track' }
                    action={() => {
                        updateActiveSwitch('track')
                    }}
                    title={strings.search.vkm.trackTitle}
                    tooltipText={strings.search.tips.vkmTrackExamples}
                    tooltipAddress={strings.search.tips.vkmTrack}
                    id="track"
                    tooltipEnabled={activeSwitch === 'track'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'track' &&  (
                <>
                <StyledSearchSection>
                    <>
                        <StyledInput
                            type="text"
                            placeholder={strings.search.track.tracknumber  }
                            value={getSearchValuePart(searchValue, searchType, 0, true)}
                            onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 0, e.target.value) }
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleSeach(searchValue);
                                }
                            }}
                        />
                        <StyledInputHalf
                            type="text"
                            placeholder={ strings.search.track.trackkm}
                            value={getSearchValuePart(searchValue, searchType, 1, true)}
                            onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 1, e.target.value) }
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleSeach(searchValue);
                                }
                            }}
                        />
                        <StyledInputHalf
                            type="text"
                            placeholder={ strings.search.track.trackm}
                            value={getSearchValuePart(searchValue, searchType, 2, true)}
                            onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 2, e.target.value) }
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleSeach(searchValue);
                                }
                            }}
                        />
                    </>
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                        activeSwitch={activeSwitch}
                    />        
                </StyledSearchSection>    
                </>
                )
                }
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch==='address'}
                    action={() => {
                        updateActiveSwitch('address')
                    }}
                    title={strings.tooltips.searchButton}
                    tooltipText={strings.search.tips.addressExamples}
                    tooltipAddress={strings.search.tips.address}
                    id='address'
                    tooltipEnabled={activeSwitch === 'address'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'address' &&  (
                <>
                <StyledSearchSection>
                    <StyledInput
                        type="text"
                        placeholder={strings.tooltips.searchButton}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                        activeSwitch={activeSwitch}
                    />        
                </StyledSearchSection>    
                </>
                )
                }   
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch==='nomenclature'}
                    action={() => {
                        updateActiveSwitch('nomenclature')
                    }}
                    title={strings.search.nomenclature.title}
                    tooltipText={strings.search.tips.nomenclatureExamples}
                    tooltipAddress={strings.search.tips.nomenclature}
                    id='nomenclature'
                    tooltipEnabled={activeSwitch === 'nomenclature'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'nomenclature' &&  (
                <>    
                <StyledSearchSection>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.nomenclature.title }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                        activeSwitch={activeSwitch}
                    />        
                </StyledSearchSection>
                </>
                )
                }          
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch==='premise'}
                    action={() => {
                        updateActiveSwitch('premise')
                    }}
                    title={strings.search.premise.title}
                    tooltipText={strings.search.tips.realEstateUnitIdentifierExamples}
                    tooltipAddress={strings.search.tips.realEstateUnitIdentifier}
                    id='premise'
                    tooltipEnabled={activeSwitch === 'premise'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'premise' &&  (
                <>    
                <StyledSearchSection>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.premise.title }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                        activeSwitch={activeSwitch}
                    />        
                </StyledSearchSection>        
                </>
                )
                } 
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch ==='layer'}
                    action={() => {
                        updateActiveSwitch('layer')
                    }}
                    title={strings.search.layer.title}
                    tooltipText={strings.search.tips.layerExamples}
                    tooltipAddress={strings.search.tips.layer}
                    id='layer'
                    tooltipEnabled={activeSwitch === 'layer'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'layer' &&  (
                <> 
                <StyledSearchSection>   
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.layer.title }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                            activeSwitch={activeSwitch}
                    /> 
                </StyledSearchSection>       
                </>
                )
                }
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch ==='feature'}
                    action={() => {
                        updateActiveSwitch('feature')
                    }}
                    title={strings.search.feature.title}
                    tooltipText={strings.search.tips.featureExamples}
                    tooltipAddress={strings.search.tips.feature}
                    id='layer'
                    tooltipEnabled={activeSwitch === 'feature'}
                    isMobile={isMobile}
                /> 
                }
                {activeSwitch === 'feature' &&  (
                <> 
                <StyledSearchSection>   
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.feature.title }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                    />
                </StyledSearchSection>       
                </>
                )
                }
         </>
                { activeSwitch == null &&
                    <SearchResultPanel 
                        isSearchOpen={isSearchOpen}
                        searchResults={searchResults}
                        showSearchResults={showSearchResults}
                        searchType={searchType}
                        dropdownVariants={dropdownVariants}
                        firstSearchResultShown={firstSearchResultShown}
                        handleSearchSelect={handleSearchSelect}
                        setFirstSearchResultShown={setFirstSearchResultShown}
                        isMobile={isMobile}
                        setShowSearchResults={setShowSearchResults}
                        setSearchClickedRow={setSearchClickedRow}
                        searchClickedRow={searchClickedRow}
                        allLayers={allLayers}
                    />
                }
        </StyledSearchModal>
    ) : null
};

export default SearchModal;