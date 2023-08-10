import styled from 'styled-components';
import strings from '../../translations';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from '../switch/Switch';
import {
    faLongArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import SearchResultPanel from './SearchResultPanel';


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
    margin-bottom: 16px;
`;


const StyledLinkText = styled.a`
    margin-bottom: 10px;
`;

const VerticalAlign = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const getSearchValuePart = (searchValue, searchType, part) => {
    const splittedSearchArray = splitSearchValue(searchValue, searchType, part);
    let retVa;
    if(splittedSearchArray !== undefined && (splittedSearchArray.length -1) >= part
        && typeof splittedSearchArray[part] !== 'undefined') {
        retVa= splittedSearchArray[part];       
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

const splitSearchValue = (searchValue, searchType) => {
    let roadParts;
    if (searchValue!== "" && searchType !== undefined &&
        searchType === 'address' && searchValue.includes("/")){
        //if roadsearch contains space, ingnore and handle on search field, range search case
        if (searchValue.includes(' ')){
            let partsArray = searchValue.split(" ");
            roadParts = partsArray[0].split("/").concat(partsArray[1].split("/"));
        }else {
            roadParts =  searchValue.split("/");
        }            
       
    }
    return roadParts;
}

/**
 * update searchValue attribute
 * @param {*} searchValue 
 * @param {*} searchType 
 * @param {*} value 
 * @param {*} part part of roadsearch to update 0=tie, 1=osa, 2= ajorata, 3= etäisyys
 */
const updateRoadSearchValue = (searchValue, searchType, setSearchValue, part, value) => {
    //const oldPart = getSearchValuePart(searchValue, searchType, part);
    let searchArray = splitSearchValue(searchValue, searchType);
    if ((searchArray!==undefined && searchArray!=="") && searchArray.length >= part){
        //empty value in the middle remove values on right side
        if (value === ""){
            searchArray.length=part
        }
        searchArray[part] = value; 
        //range search add empty space between parts
        if (part > 3){
            //add empty space between range search values
            searchArray.splice(4, 0, " ");
        }   
        const updatedSearchValue= parseSearchValueFromParts(searchArray)
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

const parseSearchValueFromParts = (partsArray) => {
    let newSearchValue;
    //if range search (more than 4 params) add space between
    if (partsArray !== undefined && partsArray.length > 3 && partsArray.includes(' ')){
        newSearchValue = [partsArray.slice(0, 4).join('/'), ' ',partsArray.slice(5).join('/')].join('') ;
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
    toggleModal
}) => {
    const [activeSwitch, setActiveSwitch] = useState("road");
    const updateActiveSwitch = (type) => {
        setActiveSwitch(type);
        setSearchResults(null);
        setShowSearchResults(false);
        setSearchValue('');
        if(type === 'layer')
        setSearchType('metadata');
        else 
        setSearchType('address');
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
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.tie }
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 0, e.target.value) }
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
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 1, e.target.value) }
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
                        value={getSearchValuePart(searchValue, searchType, 2)}
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 2, e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    </div>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.etaisyys }
                        value={getSearchValuePart(searchValue, searchType, 3)}
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 3, e.target.value) }
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
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 4, e.target.value) }
                        value={getSearchValuePart(searchValue, searchType, 4)}
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
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 5, e.target.value) }
                        value={getSearchValuePart(searchValue, searchType, 5)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    <StyledInputHalf
                        type="text"
                        placeholder={ strings.search.vkm.ajorata}
                        value={getSearchValuePart(searchValue, searchType, 6)}
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 6, e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                    />
                    </div>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.vkm.etaisyysLoppu }
                        value={getSearchValuePart(searchValue, searchType, 7)}
                        onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 7, e.target.value) }
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
                        showOnlyType='road'
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
                            onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 0, e.target.value) }
                            value={getSearchValuePart(searchValue, searchType, 0)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleSeach(searchValue);
                                }
                            }}
                        />
                        <StyledInputHalf
                            type="text"
                            placeholder={ strings.search.track.trackkm}
                            value={getSearchValuePart(searchValue, searchType, 1)}
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
                            value={getSearchValuePart(searchValue, searchType, 2)}
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
                        showOnlyType='track'
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
                        showOnlyType='address'
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
                        showOnlyType='nomenclature'
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
                        showOnlyType='premise'
                    />        
                </StyledSearchSection>        
                </>
                )
                }  
                <div style= {{clear: "both"}} />
                {
                    <Switch 
                    isSelected={activeSwitch==='layer'}
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
                        showOnlyType='layer'
                    /> 
                </StyledSearchSection>       
                </>
                )
                }  
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
        />        
        </StyledSearchModal>
    ) : null
};

export default SearchModal;