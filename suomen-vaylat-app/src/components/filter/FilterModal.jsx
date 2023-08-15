import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import strings from '../../translations';
import Dropdown from '../select/Dropdown';
import { faPlus, faTimes, faTrash, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { fetchFeaturesSynchronous, fetchContentFromChannel } from '../../utils/gfiUtil';
import { setWarning } from '../../state/slices/uiSlice';


import { setFilters, setFilteringInfo , setVKMData, setGFICroppingArea, setGFILocations } from '../../state/slices/rpcSlice';


const BODY_SIZE_EXCEED = "BODY_SIZE_EXCEED";
const GENERAL_FAIL = "GENERAL_FAIL";


const StyledFilterProp = styled.div`

`;  

const StyledFilterPropContainer = styled.div`
    width: 95%;
`;  


const StyledFilterHeader = styled.div`
    font-size: 16px;
    font-weight: bold;
`;  

const StyledModalContainer = styled.div`
    :after {
        content: "";
        display: table;
        clear: both;
    }
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 30px;
    margin-bottom: 30px;
    min-height: 160px;
    min-width: 800px;
    position: relative;
`;

const StyledModalFloatingChapter = styled.div`
    float: left;
    width: 29%;
    margin-left: 6px;
    position: relative; 
`;
const StyledModalFloatingActionChapter = styled.div`
    width: 7%;
    margin-left: 6px;
    float: left;
    position: relative; 
`;


const StyledInput = styled.input`
    width: 100%;
    padding-left: 12px;
    font-size: 16px;
    padding-top: 10px;
    border-radius: 4px;
    border: 2px solid;
    border-color: hsl(0, 0%, 80%);
    padding: 5px 10px;
`;

const StyledFilterContainer = styled.div`
    padding-top: 1em;
    margin-left: 6px;
    //position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const StyledFilterResultContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledFilterReusltButtons = styled.div`
    display: flex;
    align-items: flex-end;
`;

const StyledFilter = styled.div`
    background-color: #f2f2f2;
    //float: left;
    border: solid 1px black;
    border-radius: 7px;
    //margin-left: 5px;
    margin-bottom: 5px;
    padding-left: 3px;
    padding-right: 3px;
    :nth-child(odd) {
        background-color: white;
        //margin-left: 5px;
    }
    :nth-child(3) {
        //float: none;
    }
    display: flex;
`;

const StyledSelectedTabDisplayOptionsButton = styled.div`
    position: relative;
    right: 0px;
    padding: 8px;
    cursor: pointer;
    color: ${(props) => props.theme.colors.mainColor1};
    svg {
        font-size: 24px;
    };
`;

const StyledIconWrapper = styled.div`
    border: none;
    background: none;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
    float: right;
    margin-right: 8px;
`;

const StyledFloatingDiv = styled.div`
    :after {
        content: "";
        display: table;
        clear: both;
    }
`;

export const FilterModal = ({chosenQueryGeometry}) => {
    console.log("?")
    const { warnings, filters, selectedLayers, activeGFILayer, filteringInfo, channel, gfiLocations } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);

    const [ operatorValue,  setOperatorValue] = useState({});
    const [ filterValue, setFilterValue] = useState("");
    const [ propValue, setPropValue] = useState({});

    useEffect(() => {
        const filtersFromLocalStorage = JSON.parse(localStorage.getItem('filters'));
        if (filtersFromLocalStorage) {
            store.dispatch(setFilters(filtersFromLocalStorage));
        }
      }, []);

    const addFilter = () => {
        const prop = propValue.value;
        const value = filterValue;
        const oper = operatorValue.value;
        const layer = filteringInfo?.chosenLayer; 

        if (!prop || !value || !oper){
            return
        }
        store.dispatch(setFilters(
            [...filters,
            {   
                "layer" : layer,
                "property": prop,
                "operator": oper,
                "value": value
            }
        ]
        ));
        setPropValue({})
        setFilterValue("")
        setOperatorValue({})
    }
    const gfiFilteringOptions = [
    { value: 'equals', label: 'Yhtäsuuri kuin' },
    { value: 'notEquals', label: 'Erisuuri kuin' },
    { value: 'smallerThan', label: 'Pienempi kuin' },
    { value: 'biggerThan', label: 'Suurempi kuin' },
    ];
    
    useEffect(() => {
        const filterInfoFromlStorage = JSON.parse(localStorage.getItem('filteringInfo'));
        if (filterInfoFromlStorage) {
            store.dispatch(setFilteringInfo(filterInfoFromlStorage));
        }
      }, []);

    useEffect(() => {
        localStorage.setItem('filteringInfo', JSON.stringify(filteringInfo));
    }, [filteringInfo]);

     useEffect(() => {
        console.log(activeGFILayer)
        store.dispatch(setFilteringInfo({...filteringInfo, chosenLayer: activeGFILayer[0]?.id}));
    }, [activeGFILayer]);  

    const [activeFilters, setActiveFilters] = useState();

    useEffect(() => {
        console.log(filteringInfo)
        console.log(filters)

        if (filteringInfo && filteringInfo?.chosenLayer && filters){
            const updatedActivefilters = filters.filter(filter => filter.layer === filteringInfo?.chosenLayer)
            setActiveFilters(updatedActivefilters)
            //fetchContentFromChannel(activeGFILayer, chosenQueryGeometry, filters, store, channel)
        }
     }, [filters, filteringInfo]);
   
    const handleRemoveFilter = (filter) => {

        if (filters && filters.length > 0 && filters.includes(filter)){
            const updatedFilters = filters.filter(existingFilter => existingFilter !== filter )
            store.dispatch(setFilters(updatedFilters));
        }
    }

    const handleRemoveAllFilters = () => {
        if (filters && filters.length > 0){
            store.dispatch(setFilters([]));
        }
    }
    
    const handleApplyFilters = () => {
        if (filters && filters.length > 0){
            console.log("lisää filtteri")
            // lisää suodattimet
            fetchContentFromChannel(activeGFILayer, chosenQueryGeometry, filters, store, channel)
        }
    }

    const filterOptions = () => {
        console.log(filteringInfo)
        const curLayer = filteringInfo?.chosenLayer;
        //const layerinfo = filteringInfo?.layers[curLayer]; 

        var layer = filteringInfo?.layers?.find(layer => {
            return layer.id === curLayer
          })
        const options = layer?.tableProps?.columns?.map( column => {
            return { value: column.key, label: column.title}
        }
        )
        return options;
    }

    const fetchContentFromChannel = (fetchableLayers, featureArray, filters, store, channel) => {

        console.log(gfiLocations)
        console.info("featurearray", featureArray)
        //featureArray?.forEach(async feature => {
            store.dispatch(setGFICroppingArea(featureArray));
            
            let index = 0;
            try {
                for(const layer of fetchableLayers) {  
                    console.log(filters)
                    console.log(layer)
    
                    const activeFilters = filters && filters?.length > 0 ?  filters?.filter(filter => (filter.layer ===  layer.name)) : [];
                    console.log(activeFilters)
                    //console.info("feature" ,feature)
                    fetchFeaturesSynchronous(featureArray, layer, featureArray, activeFilters, store, channel, gfiLocations)
                    .then(
                        index++
                    ).catch((error) => {
                            if (error===BODY_SIZE_EXCEED){
                                store.dispatch(setWarning({
                                    title: strings.bodySizeWarningTemporary,
                                    subtitle: null,
                                    cancel: {
                                        text: strings.general.cancel,
                                        action: () => {
                                            store.dispatch(setWarning(null))
                                        }
                                    },
                                    /*TODO return when simplify geometry feature ready 
                                        confirm: {
                                        text: strings.general.continue,
                                        action: () => {
                                            simplifyGeometry();
                                            store.dispatch(setWarning(null));
                                        }
                                    },*/
                                }))
                            
                                //throw error to break synchronous loop
                                throw new Error(BODY_SIZE_EXCEED);
                            }else if (error === GENERAL_FAIL){
                                console.info("general fail thrown") 
                            }
                        }
                    );
    
                } 
            } catch (error) {
                //catch exception, when simplify geometry feature ready, catch BODY_SIZE_EXCEED
                //and make simplify and rerun query
            }
            
        //}); 
    }
    
    const fetchFeaturesSynchronous = (features, layer, data, activeFilters, store, channel, gfiLocations) => {
        return new Promise(function(resolve, reject) {
        // executor (the producing code, "singer")
        console.log(gfiLocations)

        channel.getFeaturesByGeoJSON(
            [features, 0, [layer.id], activeFilters],
            (gfiData, gfiLocations) => {
                console.info("datski", gfiData)
                store.dispatch(setVKMData(null));
                console.log(gfiLocations)

                channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ["VKM_MARKER"]);
                    gfiData?.gfi?.forEach((gfi, gfiLocations) => {
                        if (gfi.content.length > 0) {
                            console.log(gfiLocations)

                            store.dispatch(setGFILocations({
                                content: gfi.content,
                                layerId: gfi.layerId,
                                gfiCroppingArea:
                                data.geojson,
                                type: 'geojson',
                                moreFeatures: gfi.content.some(content => content.moreFeatures),
                            })) 
                        }
                    });
                    resolve("ok");                  
                },
                function (error) {
                    console.info("erska", error)
                    if (error.BODY_SIZE_EXCEEDED_ERROR) {
                        // simplify modal removed for now, uncomment when simplifyGeometry feature ready, make new call after
                        /*store.dispatch(setWarning({
                            title: strings.bodySizeWarning,
                            subtitle: null,
                            cancel: {
                                text: strings.general.cancel,
                                action: () => {
                                    setIsGfiLoading(false);
                                    store.dispatch(setWarning(null))
                                }
                            },
                            confirm: {
                                text: strings.general.continue,
                                action: () => {
                                    simplifyGeometry();
                                    store.dispatch(setWarning(null));
                                }
                            },
                        }))
                        */
                        reject(BODY_SIZE_EXCEED)
                    }      
                    reject(GENERAL_FAIL)
                }
            )
        });
    }  

    return (
        <StyledModalContainer>
            <StyledModalFloatingChapter>
            <Dropdown 
                options={filterOptions()}
                placeholder={strings.gfifiltering.placeholders.chooseProp}
                value={propValue}
                setValue={setPropValue}
            />
            </StyledModalFloatingChapter>
            <StyledModalFloatingChapter>
            <Dropdown 
                options={gfiFilteringOptions}
                placeholder={strings.gfifiltering.placeholders.chooseOperator}
                value={operatorValue}
                setValue={setOperatorValue}
            />
            </StyledModalFloatingChapter>
            <StyledModalFloatingChapter>
            <StyledInput
                type="text"
                value={filterValue}
                placeholder={strings.gfifiltering.placeholders.chooseValue}
                onChange={e => setFilterValue(e.target.value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        addFilter();
                    }
                }}
            />
            </StyledModalFloatingChapter>
            <StyledModalFloatingActionChapter>
                <StyledSelectedTabDisplayOptionsButton
                    onClick={() =>  addFilter()}
                >
                <FontAwesomeIcon icon={faPlus} />
                </StyledSelectedTabDisplayOptionsButton>
            </StyledModalFloatingActionChapter>
        
            {activeFilters && activeFilters.length > 0 && (
                            <StyledFilterContainer>
                                <StyledFilterResultContainer>
                                    <StyledFilterHeader style={{marginBottom: '.5em'}}>{strings.gfifiltering.activeFilters}</StyledFilterHeader>
                                        {
                                        activeFilters.map( (filter) =>  
                                        <StyledFilter>
                                        <StyledFilterPropContainer>      
                                            <StyledFilterProp>{strings.gfifiltering.property}:  {filter.property}</StyledFilterProp> 
                                            <StyledFilterProp>{strings.gfifiltering.operator}:  {strings.gfifiltering.operators[filter.operator]} </StyledFilterProp> 
                                            <StyledFilterProp>{strings.gfifiltering.value}: {filter.value}</StyledFilterProp> 
                                        </StyledFilterPropContainer>
                                        <StyledIconWrapper
                                        onClick={() => {
                                            handleRemoveFilter(filter);
                                        }}>
                                        <StyledFloatingDiv><FontAwesomeIcon icon={faTimes} size="6x" style={{marginLeft: '.5em'}}/></StyledFloatingDiv>
                                        </StyledIconWrapper>
                                    </StyledFilter>
                                    )}
                                </StyledFilterResultContainer>
                                <StyledFilterReusltButtons>
                                    <StyledIconWrapper 
                                        onClick={() => {
                                            handleApplyFilters();
                                        }}>
                                        <StyledFloatingDiv>Suodata <FontAwesomeIcon icon={faBullhorn} size="6x" style={{}}/></StyledFloatingDiv>
                                    </StyledIconWrapper>  
                                    <StyledIconWrapper 
                                        onClick={() => {
                                            handleRemoveAllFilters();
                                        }}>
                                        <StyledFloatingDiv>Poista kaikki suodattimet <FontAwesomeIcon icon={faTrash} size="6x" style={{}}/></StyledFloatingDiv>
                                    </StyledIconWrapper>
                                </StyledFilterReusltButtons>                   
                            </StyledFilterContainer>
                        )
                        }
        </StyledModalContainer>

    )
}