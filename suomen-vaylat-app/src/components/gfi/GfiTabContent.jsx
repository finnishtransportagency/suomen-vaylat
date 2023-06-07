import { useState, useEffect, useCallback  } from 'react';
import styled from 'styled-components';

import GfiTabContentItem from './GfiTabContentItem';
import strings from '../../translations';

import { faTable, faList, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { kaReducer, Table } from 'ka-table';
import "ka-table/style.scss";
import Modal from '../modals/Modal';
import Dropdown from '../select/Dropdown';
import { setFilter } from '../../state/slices/rpcSlice';

const StyledSelectedTabHeader = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 4px 0px rgb(0 0 0 / 20%);
    z-index: 2;
`;

const StyledSelectedTabTitle = styled.div`
    padding: 8px;
    p {
        color: ${(props) => props.theme.colors.mainColor1};
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }
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

const StyledTabContent = styled.div`
    td:nth-child(odd) {
        border-right: 1px solid #ddd;
    }

    tr:nth-child(2n) {
        background-color: #f2f2f2;
    }

    table tr {
        border-bottom: 1px solid #ddd;
    }
`;
/*
    min-width: 600px;
    max-width: 600px;
    padding: 16px;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        min-width: initial;
    };
    width: 600px;
    height: 400px;
    padding: 16px;
    position: absolute;
    top: 300px;
    border: solid;
    background-color: #0064af;
    left: 500px;
*/
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
    //left: calc(-50vw + 50%);
`;

const StyledModalFloatingChapter = styled.div`
    float: left;
    width: 29%;
    margin-left: 6px;
    //z-index: 1;
    position: relative; 
`;
const StyledModalFloatingActionChapter = styled.div`
    width: 7%;
    margin-left: 6px;
    float: left;
    //z-index: 1;
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
    margin-left: 6px;
    //position: relative;
    width: 100%;
    height: 100%;
    
`;

const StyledFilter = styled.div`
    background-color: #f2f2f2;
    width: 300px;
    float: left;
    border: solid 1px black;
    border-radius: 7px;
    //margin-left: 5px;
    margin-bottom: 5px;
    padding-left: 3px;
    padding-right: 3px;
    :nth-child(odd) {
        background-color: white;
        margin-left: 5px;
    }
    :nth-child(3) {
        //float: none;
    }
`;


const GfiTabContent = ({
    data,
    title,
    tablePropsInit,
    constraintsRef,
    minimize,
    maximize,
    filters,
    setFilters
}) => {

    const [tableProps, changeTableProps] = useState(tablePropsInit);
    const [filtering, setFiltering] = useState(false);
    //const [filters, setFilters] = useState([]);
    const [filteredData, setFilteredData] = useState(data?.content?.features);
    const [ operatorValue,  setOperatorValue] = useState({});
    const [ filterValue, setFilterValue] = useState("");
    const [ propValue, setPropValue] = useState({});
    const [ activeFilters, setActiveFilters ]= useState([]);
    const dispatch = action => {
      changeTableProps(prevState => kaReducer(prevState, action));
    };


    //useEffect(() => {
    //    //console.info("filteredData", filteredData)
    //}, [filteredData, data])

    useEffect(() => {
        changeTableProps(tablePropsInit);
    }, [tablePropsInit]);

    //useEffect(() => {
    //   console.info("filters", filters)
    //}, [filters]);

    const [showDataTable, setShowDataTable] = useState(data.content && data.content.features && data.content.features.length > 5);

    const selectFeature = (channel, features) => {
        let featureStyle = {
            fill: {
                color: '#e50083',
            },
            stroke: {
                color: '#e50083',
                width: 5,
                lineDash: 'solid',
                lineCap: 'round',
                lineJoin: 'round',
                area: {
                    color: '#e50083',
                    width: 4,
                    lineJoin: 'round'
                }
            },
            image: {
                shape: 5,
                size: 3,
                fill: {
                    color: '#e50083',
                }
            }
        };

        let options = {
            featureStyle: featureStyle,
            layerId: 'gfi-result-layer-overlay',
            animationDuration: 200,
            clearPrevious: true,
        };

        let rn = 'MapModulePlugin.AddFeaturesToMapRequest';

        var geojsonObject = {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'EPSG:3067'
                }
            },
            features: features
        };

        channel.postRequest(rn, [geojsonObject, options])
    };

    const deSelectFeature = (channel) => {
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
            null,
            null,
            'gfi-result-layer-overlay',
        ]);
    };
    /*const propOptions = [
        { value: 'prop1', label: 'Ominaisuus1' },
        { value: 'prop2', label: 'Ominaisuus2' },
        { value: 'prop3', label: 'Ominaisuus3' },
      ];
     */
    
    const propOptions = tableProps?.columns.map( column => {  
        return { value: column.key, label: column.title}
    } )
      const gfiFilteringOptions = [
        { value: 'equals', label: 'Yhtäsuuri kuin' },
        { value: 'notEquals', label: 'Erisuuri kuin' },
        { value: 'smallerThan', label: 'Pienempi kuin' },
        { value: 'biggerThan', label: 'Suurempi kuin' },
      ];


    const filterFeatures =  useCallback(() => {
        let filteredFeatures = [];
        filters.forEach(filter => {
            // updateFilteredData = updateFilteredData?.content?.features.filter((feature) => {
            //     return feature.properties.hasOwnProperty(filter.property)
            //     && feature.properties[filter.property] === filter.value 

            // }
            //let features = updateFilteredData?.content?.features;
            //const filteredFeatures = filteredData?.content?.features.filter((feature) => {
            filteredFeatures = filteredData?.filter((feature) => {
                //console.info("isMatch", feature.properties.hasOwnProperty(filter.property)
                //&& 
                //feature.properties[filter.property] === filter.value
                //);
                //console.info("filter prop", filter.property)
                return feature.properties.hasOwnProperty(filter.property)
                && feature.properties[filter.property] === filter.value; 
            })
          
          
            //setFilteredData(filteredFeatures)
            //updatedFilteredData.content.features = filteredFeatures;
            //setFilteredData({filteredData.content.features = filteredFeatures
            //    filteredData.content.features = filteredFeatures})
         
            //console.info("datski ", filteredFeatures)
            //if (data?.content?.features?)
            
        }
        )
        if (filteredFeatures && filteredFeatures.length >0)
        setFilteredData(filteredFeatures)
    }, [filteredData, filters] )

    // useEffect (() => {
    //     let filteredFeatures = [];
    //     filters.forEach(filter => {
    //         filteredFeatures = filteredData?.filter((feature) => {
    //             console.info("isMatch", feature.properties.hasOwnProperty(filter.property)
    //             && feature.properties[filter.property] === filter.value
    //             );
    //             console.info("filter prop", filter.property)
    //             return feature.properties.hasOwnProperty(filter.property)
    //             && feature.properties[filter.property] === filter.value; 
    //         })
    //     }
    //     )
    //     if (filteredFeatures && filteredFeatures.length >0)
    //     setFilteredData(filteredFeatures)
    // }, [filteredData, filters])
    // useEffect(() => {
       
    //    // const filterFeatures = (datuuki)  => {
    //         //var updatedFilteredData = {...filteredData};
    //         console.info("features", filteredData);
    //         //if (filters && filters.length > 0 && 
    //         //    filters.some((filter)  => filter.title = title ) ){
    //             let filteredFeatures = [];
    //                 filters.forEach(filter => {
    //                     // updateFilteredData = updateFilteredData?.content?.features.filter((feature) => {
    //                     //     return feature.properties.hasOwnProperty(filter.property)
    //                     //     && feature.properties[filter.property] === filter.value 
            
    //                     // }
    //                     //let features = updateFilteredData?.content?.features;
    //                     //const filteredFeatures = filteredData?.content?.features.filter((feature) => {
    //                     filteredFeatures = filteredData?.filter((feature) => {
    //                         console.info("isMatch", feature.properties.hasOwnProperty(filter.property)
    //                         && feature.properties[filter.property] === filter.value
    //                         );
    //                         console.info("filter prop", filter.property)
    //                         return feature.properties.hasOwnProperty(filter.property)
    //                         && feature.properties[filter.property] === filter.value; 
    //                     })
                      
                      
    //                     //setFilteredData(filteredFeatures)
    //                     //updatedFilteredData.content.features = filteredFeatures;
    //                     //setFilteredData({filteredData.content.features = filteredFeatures
    //                     //    filteredData.content.features = filteredFeatures})
                     
    //                     //console.info("datski ", filteredFeatures)
    //                     //if (data?.content?.features?)
                        
    //                 }
    //                 )
    //                 if (filteredFeatures && filteredFeatures.length >0)
    //                 setFilteredData(filteredFeatures)
    //            // }
          
    //         //
    //         //setFilteredData(updatedFilteredData)
    //         //console.info("updatedFilteredData ", updatedFilteredData)
    //         //return updatedFilteredData;
    //    //}
    //     //filterFeatures();
       
    //     //filterFeatures(data)
    //     console.info("datski effect", filteredData)
    //     console.info("filters effect", filters)
    // }, [filteredData, filters]);
  
     useEffect (( ) => {
        console.info("propValue", propValue)
        console.info("filterValue", filterValue)
        console.info("operatorValue", operatorValue)
     }, [propValue, filterValue, operatorValue])
   

    useEffect (() => {
       setActiveFilters(filters && filters.length >0 && filters.filter(filter => filter.layer === title) )
    }, [filters] )
    
    const addFilter = () => {
        // const prop = "ilman_lampotila";
        // const value = -4;
        // const oper = "equals";
        // const layer = title;
        const prop = propValue.value;
        const value = filterValue;
        const oper = operatorValue.value;
        const layer = title;

        if (!prop || !value || !oper){
            return
        }
        //console.info("nyt filtteröidään", prop, oper, value)
        setFilters(//current => [...current,
            [...filters,
            {   
                "layer" : layer,
                "property": prop,
                "operator": oper,
                "value": value
            }
        ]
        )
        //filterFeatures()
        setPropValue({})
        setFilterValue("")
        setOperatorValue({})
    }


   
    const closeFilteringModal = () => {
        setFiltering(false);
        console.info("closefiltering")
    }
    //console.info("tableProps", propOptions, tableProps  )
    return <>
            <StyledSelectedTabHeader>
                <StyledSelectedTabTitle>
                    <p>
                        {
                            title.toUpperCase()
                        }
                    </p>
                </StyledSelectedTabTitle>
                <StyledSelectedTabDisplayOptionsButton
                    onClick={() =>  setFiltering(!filtering)}
                >
                    <FontAwesomeIcon icon={filtering ? faFilter : faFilter} />
                </StyledSelectedTabDisplayOptionsButton>
                {filtering && 
                <Modal
                    constraintsRef={
                        {constraintsRef}
                    } /* Reference div for modal drag boundaries */
                    drag={true} /* Enable (true) or disable (false) drag */
                    resize={true}
                    backdrop={
                        false
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={
                        null
                    } /* Use icon on title or null */
                    title={strings.gfi.filter} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        closeFilteringModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={filtering} /* Modal state */
                    id={null}
                    minimize={minimize}
                    maximize={maximize}
                    height='180px'
                    width='800px'
                >
                <StyledModalContainer>
                   
                    <StyledModalFloatingChapter>
                    <Dropdown 
                      options={propOptions}
                      action={()=>{console.info("valittu propsu", propValue)}}
                      placeholder={strings.gfifiltering.placeholders.chooseProp}
                      value={propValue}
                      setValue={setPropValue}
                    />

                    </StyledModalFloatingChapter>
                    <StyledModalFloatingChapter>
                    <Dropdown 
                      options={gfiFilteringOptions}
                      action={()=>{console.info("valittu tyyppä", operatorValue)}}
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
                                 console.info( "lähetään suodattaa ", e.target.value );
                                 addFilter();
                                //setFilterValue(e.target.value);
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
                   
                    {filters && filters.length > 0 && (
                        <StyledFilterContainer>
                            <div>{strings.gfifiltering.activeFilters}</div>
                            {activeFilters && activeFilters.length >0 && activeFilters.map( (filter) =>  
                            //filters && filters.length >0 && filters.map( (filter) =>  
                            <StyledFilter>{strings.gfifiltering.property}: {filter.property} <br/>
                                {strings.gfifiltering.operator}:  {filter.operator}<br/>
                                {strings.gfifiltering.value}: {filter.value}
                                </StyledFilter>
                             )}                        
                        </StyledFilterContainer>
                    )
                    }
                </StyledModalContainer>
            </Modal>
            }
                <StyledSelectedTabDisplayOptionsButton
                    onClick={() =>  setShowDataTable(!showDataTable)}
                >
                    <FontAwesomeIcon icon={showDataTable ? faList : faTable} />
                </StyledSelectedTabDisplayOptionsButton>
            </StyledSelectedTabHeader>
                        
        {
            showDataTable ?
                <Table
                    {...tableProps}
                    dispatch={dispatch}
                />
            :
            <div style={{
                overflow: 'auto'
            }}>
                <StyledTabContent>
                    {
                        //filterFeatures(data)
                        //.then(filtered => {
                        //filterFeatures()
                        //    .then(() => {            
                            filteredData.map((feature, index) => {
                                return <GfiTabContentItem
                                        key={feature.id}
                                        title={feature.id.split('.')[1] ? title + ` | ${strings.gfi.uniqueId } ` + feature.id.split('.')[1] : title + ' ' + feature.id}
                                        data={feature}
                                        index={index}
                                        selectFeature={selectFeature}
                                        deSelectFeature={deSelectFeature}
                                    />
                                })
                        //} )

                    }
                </StyledTabContent>
  
            </div>

        }
    </>
};

export default GfiTabContent;