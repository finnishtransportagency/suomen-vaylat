import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useState } from 'react';
import SearchSwitch from './utils/SearchSwitch';
import { isMobile } from '../../theme/theme';



const StyledInput = styled.input`
    width: 100%;
    padding: 5px;
    border-radius: 15px;
    border-color: #A0A0A0;
    margin: 8px 0;
    &:focus {
    border-color: #007bff;
    outline: none;
    }
    &.error {
        border-color: ${props => props.theme.colors.secondaryColorDarkOrange};
    }
    
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
    &:focus {
    border-color: #007bff;
    outline: none;
    }
    &.error {
        border-color: ${props => props.theme.colors.secondaryColorDarkOrange};
    }

`;

const StyledFeatureSearchSection = styled.div`
    display: flex;
    flex-direction: column; 
    width: 90%;
    margin-bottom: 1em;
`;

const StyledSearchSection = styled.div`
    width: 90%;
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
`;

const StyledRoadStart = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

const StyledRoadEnd = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledTrackWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledTrackInputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

const StyledCheckbox = styled.input`
    float: right;
    width: 16px;
    height: 16px;
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const CheckboxLabel = styled.label`
    font-size: 16px;
    margin-left: 8px;
    color: ${props => props.theme.colors.darkGrey};
`
const StyledValidationMessage = styled.div`
    color: ${props => props.theme.colors.secondaryColorDarkOrange};
`

const StyledSelectedLayerWrapper = styled.div`
    display: flex;
    align-items: baseline;
    margin-left: 0.5em;
    margin-bottom: 4px
    overflow: hidden;
    white-space: nowrap;
`
const StyledSelectedLayerTitle = styled.div`
    color: ${props => props.theme.colors.mainColor1};
    font-size: 16px;
    font-weight: 500;
`
const StyledSelectedLayerText = styled.div`
    font-size: 15px;
    font-weight: 400;
    margin-left: 0.5em;
    margin-right: 0.5em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        white-space: normal;
    }
`
const StyledNoActivaLayers = styled.div`
    color: ${props => props.theme.colors.secondaryColorDarkOrange};
    font-size: 16px;
    font-weight: 500;
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
    return newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue;
}

const getTrackSearchValuePart = (position, searchValue) => {
    if (!searchValue) return '';
    const searchArray = searchValue.split("/");
    return searchArray[position] || '';
}

const updateTrackSearchValue = (newValue, position, searchValue, setSearchValue, trackErrors, setTrackErrors ) => {
    // Update errors
    const newErrors = [...(trackErrors ?? [])];
    newErrors[position] = newValue === '';
    setTrackErrors(newErrors);
    // Modify the search value
    let searchArray = searchValue ? searchValue.split("/") : ['','',''];
    searchArray[position] = newValue;
    // Join the parts back into a single string
    const newSearchValue = searchArray.join("/");
    setSearchValue(newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue);
}

const parseTrackSearchQuery = (searchQuery) => {
    return searchQuery.endsWith('/') ? searchQuery.slice(0, -1) : searchQuery;
}



const SearchInput = ({
    searchValue,
    setSearchValue,
    searchType,
    handleSeach,
    carriageWaySearch, 
    setCarriageWaySearch,
    trackErrors,
    setTrackErrors,
    validateTrackSearch,
    featureErrors
}) => {
    const { selectedLayersByType } = useAppSelector((state) => state.rpc);
    const { activeSwitch } = useAppSelector((state) => state.ui);
    const [roadEndEnabled, setRoadEndEnabled] = useState(false);


    return (
            <>
                {activeSwitch === 'road' &&  (
                <>
                <StyledSearchSection>   
                    <StyledRoadStart>
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
                        <StyledInput
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
                        <StyledInput
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
                    </StyledRoadStart>
                    { roadEndEnabled &&
                        <StyledRoadEnd>

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

                    </StyledRoadEnd>

                    }
                    

                    <CheckboxWrapper> 
                            <StyledCheckbox
                                id='carriageWaySearchBox'
                                name='carriageWaySearchBox'
                                type='checkbox'
                                onChange={() => (setCarriageWaySearch(!carriageWaySearch))}
                                checked={carriageWaySearch}
                            />
                            <CheckboxLabel htmlFor='carriageWaySearchBox'>{strings.search.carriageWaySearch}</CheckboxLabel>
                    </CheckboxWrapper>

                    <CheckboxWrapper> 
                            <StyledCheckbox
                                id='roadEndcehckbox'
                                name='roadEndcehckbox'
                                type='checkbox'
                                onChange={() => (setRoadEndEnabled(!roadEndEnabled))}
                                checked={roadEndEnabled}
                            />
                            <CheckboxLabel htmlFor='roadEndcehckbox'>{"Anna tien loppu tiedot"}</CheckboxLabel>
                    </CheckboxWrapper>

                </StyledSearchSection>  
                </>
                )
                }
                {activeSwitch === 'track' &&  (
                <>
                <StyledSearchSection>
                    <StyledTrackWrapper>
                        <StyledTrackInputWrapper>
                            <StyledInput
                                type="text"
                                placeholder={strings.search.track.tracknumber  }
                                value={  getTrackSearchValuePart(0, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value, 0, searchValue, setSearchValue, trackErrors, setTrackErrors)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                    
                                }}
                                className={trackErrors[0] ? 'error' : ''}
                            />
                            <StyledInput
                                type="text"
                                placeholder={ strings.search.track.trackkm}
                                value={ getTrackSearchValuePart(1, searchValue, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value,1, searchValue, setSearchValue, trackErrors, setTrackErrors) }
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                    
                                }}
                                className={trackErrors[1] ? 'error' : ''}
                            />
                            <StyledInput
                                type="text"
                                placeholder={ strings.search.track.trackm}
                                value={ getTrackSearchValuePart(2, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value,2, searchValue, setSearchValue, trackErrors, setTrackErrors)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                    
                                }}
                                className={trackErrors[2] ? 'error' : ''}
                            />
                        </StyledTrackInputWrapper>
                        { trackErrors.some((error) => error === true) && (<StyledValidationMessage>{strings.search.track.trackMandatoryMessage}</StyledValidationMessage>) }
                    </StyledTrackWrapper>    
                </StyledSearchSection>    
                </>
                )
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
                </StyledSearchSection>    
                </>
                )
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
                </StyledSearchSection>
                </>
                )
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
                </StyledSearchSection>        
                </>
                )
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
                </StyledSearchSection>       
                </>
                )
                }
                {activeSwitch === 'feature' &&  (
                <> 
                <StyledFeatureSearchSection>
                    <StyledSelectedLayerWrapper>
                        { selectedLayersByType.mapLayers.length > 0 ?
                            (
                                <>
                                    <StyledSelectedLayerTitle>{ strings.search.feature.searchFromLayer }</StyledSelectedLayerTitle>
                                    <StyledSelectedLayerText>{ selectedLayersByType.mapLayers[0].name }</StyledSelectedLayerText>
                                </>
                            )
                        :
                            (
                                <StyledNoActivaLayers></StyledNoActivaLayers>
                            )
                        }
                    </StyledSelectedLayerWrapper>
                    <StyledInput
                        type="text"
                        placeholder={ strings.search.feature.title }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue.trim());
                            }
                        }}
                        className={featureErrors.length > 0 ? 'error' : ''}
                    />
                </StyledFeatureSearchSection>       
                </>
                )
                }
         </>
    )
};

export default SearchInput;