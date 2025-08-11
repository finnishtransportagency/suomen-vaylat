import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useState } from 'react';

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
    gap: 8px;
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
    if (carriageWaySearch === true) {
        if (splittedSearchArray && part > splittedSearchArray.length){
            return ""
        }else {
            actualPart = part;
        }
    } else {
        if (part === 2 || part ===6){
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

const updateRoadSearchValue = (searchValue, searchType, setSearchValue, part, value, carriageWaySearch=false) => {
    let searchArray = splitSearchValue(searchValue, searchType);
    const effectivePart = carriageWaySearch ? part : part -1
    if ((searchArray!==undefined && searchArray!=="") && searchArray.length >= effectivePart){
        if (value === ""){
            searchArray.length=part
        }
        const blancSpacePosition = carriageWaySearch ? 4 : 3
        if (part > blancSpacePosition){
            searchArray[effectivePart] = value;
        }else {
            searchArray[part] = value;
        }
        const updatedSearchValue= parseSearchValueFromParts(searchArray, blancSpacePosition)
        if (updatedSearchValue!==undefined){
            setSearchValue(updatedSearchValue);
        }
    } else if ((searchArray===undefined || searchArray==="") && value !== undefined && part === 0) {
        setSearchValue(value);
    } else if ((searchArray===undefined || searchArray==="") && searchValue !== undefined && part === 1) {
        setSearchValue(searchValue + "/" + value);
    } else if ((searchArray!==undefined && searchArray!=="") && searchArray.length === (part -1)) {
        setSearchValue(searchValue + "/" + value);
    } 
}

const parseSearchValueFromParts = (partsArray, blancSpacePosition) => {
    let newSearchValue;
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
    const newErrors = [...(trackErrors ?? [])];
    newErrors[position] = newValue === '';
    setTrackErrors(newErrors);
    let searchArray = searchValue ? searchValue.split("/") : ['','',''];
    searchArray[position] = newValue;
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
                <StyledSearchSection role="group" aria-labelledby="road-start-group">
                    <StyledRoadStart id="road-start-group">
                        <StyledInput
                            id="road-tie"
                            name={ strings.search.vkm.tie }
                            aria-label={ strings.search.vkm.tie }
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
                            id="road-osa"
                            name={ strings.search.vkm.osa }
                            aria-label={ strings.search.vkm.osa }
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
                            id="road-majorata"
                            name={ strings.search.vkm.ajorata}
                            aria-label={ strings.search.vkm.ajorata }
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
                            id="road-etaisyys"
                            name={ strings.search.vkm.etaisyys }
                            aria-label={ strings.search.vkm.etaisyys }
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
                    </StyledRoadStart>
                    { roadEndEnabled &&
                        <StyledRoadEnd>
                        <StyledInput
                            id="road-tieloppu"
                            name={ strings.search.vkm.tieloppu }
                            aria-label={ strings.search.vkm.tieloppu }
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
                        <StyledInput
                            id="road-osa-loppu"
                            name={ strings.search.vkm.osaLoppu }
                            aria-label={ strings.search.vkm.osaLoppu }
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
                        <StyledInput
                            id="road-majorata-loppu"
                            name={ strings.search.vkm.ajorata }
                            aria-label={ strings.search.vkm.ajorata }
                            type="text"
                            placeholder={ strings.search.vkm.ajorata }
                            value={getSearchValuePart(searchValue, searchType, 6, carriageWaySearch)}
                            onChange={(e) =>  updateRoadSearchValue(searchValue, searchType, setSearchValue, 6, e.target.value, carriageWaySearch)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    handleSeach(searchValue);
                                }
                            }}
                            disabled={!carriageWaySearch}
                        />
                        <StyledInput
                            id="road-etaisyys-loppu"
                            name={ strings.search.vkm.etaisyysLoppu }
                            aria-label={ strings.search.vkm.etaisyysLoppu }
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
                    {/* Checkbox - Carriage Way */}
                    <CheckboxWrapper>
                        <StyledCheckbox
                            id='carriageWaySearchBox'
                            name='carriageWaySearchBox'
                            type='checkbox'
                            aria-label={strings.search.carriageWaySearch}
                            onChange={() => (setCarriageWaySearch(!carriageWaySearch))}
                            checked={carriageWaySearch}
                        />
                        <CheckboxLabel htmlFor='carriageWaySearchBox'>{strings.search.carriageWaySearch}</CheckboxLabel>
                    </CheckboxWrapper>
                    {/* Checkbox - Road End Info */}
                    <CheckboxWrapper>
                        <StyledCheckbox
                            id='roadEndCheckbox'
                            name='roadEndCheckbox'
                            type='checkbox'
                            aria-label="Anna tien loppu tiedot"
                            onChange={() => (setRoadEndEnabled(!roadEndEnabled))}
                            checked={roadEndEnabled}
                        />
                        <CheckboxLabel htmlFor='roadEndCheckbox'>{"Anna tien loppu tiedot"}</CheckboxLabel>
                    </CheckboxWrapper>
                </StyledSearchSection>  
                </>
                )}
                {activeSwitch === 'track' &&  (
                <>
                <StyledSearchSection role="group" aria-labelledby="track-input-group">
                    <StyledTrackWrapper id="track-input-group">
                        <StyledTrackInputWrapper>
                            <StyledInput
                                id="track-tracknumber"
                                type="text"
                                placeholder={strings.search.track.tracknumber}
                                value={getTrackSearchValuePart(0, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value, 0, searchValue, setSearchValue, trackErrors, setTrackErrors)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                }}
                                className={trackErrors[0] ? 'error' : ''}
                                aria-label={strings.search.track.tracknumber}
                                aria-describedby={trackErrors[0] ? "track-error-msg" : undefined}
                            />
                            <StyledInput
                                id="track-trackkm"
                                type="text"
                                placeholder={strings.search.track.trackkm}
                                value={getTrackSearchValuePart(1, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value,1, searchValue, setSearchValue, trackErrors, setTrackErrors) }
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                }}
                                className={trackErrors[1] ? 'error' : ''}
                                aria-label={strings.search.track.trackkm}
                                aria-describedby={trackErrors[1] ? "track-error-msg" : undefined}
                            />
                            <StyledInput
                                id="track-trackm"
                                type="text"
                                placeholder={strings.search.track.trackm}
                                value={getTrackSearchValuePart(2, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value,2, searchValue, setSearchValue, trackErrors, setTrackErrors)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                }}
                                className={trackErrors[2] ? 'error' : ''}
                                aria-label={strings.search.track.trackm}
                                aria-describedby={trackErrors[2] ? "track-error-msg" : undefined}
                            />
                        </StyledTrackInputWrapper>
                        { trackErrors.some((error) => error === true) && (
                            <StyledValidationMessage id="track-error-msg">
                                {strings.search.track.trackMandatoryMessage}
                            </StyledValidationMessage>
                        )}
                    </StyledTrackWrapper>    
                </StyledSearchSection>    
                </>
                )}
                {activeSwitch === 'address' &&  (
                <>
                <StyledSearchSection>
                    <StyledInput
                        id="address-search"
                        type="text"
                        placeholder={strings.tooltips.searchButton}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                        aria-label={strings.tooltips.searchButton}
                    />     
                </StyledSearchSection>    
                </>
                )}
                {activeSwitch === 'nomenclature' &&  (
                <>    
                <StyledSearchSection>
                    <StyledInput
                        id="nomenclature-search"
                        type="text"
                        placeholder={strings.search.nomenclature.title}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                        aria-label={strings.search.nomenclature.title}
                    />      
                </StyledSearchSection>
                </>
                )}
                {activeSwitch === 'premise' &&  (
                <>    
                <StyledSearchSection>
                    <StyledInput
                        id="premise-search"
                        type="text"
                        placeholder={strings.search.premise.title}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                        aria-label={strings.search.premise.title}
                    />       
                </StyledSearchSection>        
                </>
                )}
                {activeSwitch === 'layer' &&  (
                <> 
                <StyledSearchSection>   
                    <StyledInput
                        id="metadata-search"
                        type="text"
                        placeholder={strings.search.layer.title}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue);
                            }
                        }}
                        aria-label={strings.search.layer.title}
                    />
                </StyledSearchSection>       
                </>
                )}
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
                        id="feature-search"
                        type="text"
                        placeholder={strings.search.feature.title}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value) }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSeach(searchValue.trim());
                            }
                        }}
                        className={featureErrors.length > 0 ? 'error' : ''}
                        aria-label={strings.search.feature.title}
                    />
                </StyledFeatureSearchSection>       
                </>
                )}
         </>
    )
};

export default SearchInput;
