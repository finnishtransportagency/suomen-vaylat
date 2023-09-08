import { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import GfiTabContentItem from './GfiTabContentItem';
import strings from '../../translations';
import { ReactReduxContext } from 'react-redux';
import { faTable, faList, faFilter, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../state/hooks';
import { setFilteringInfo } from '../../state/slices/rpcSlice';
import { filterFeature } from '../../utils/gfiUtil'
import { kaReducer, Table } from 'ka-table';
import "ka-table/style.scss";
import { theme, isMobile } from '../../theme/theme';
import ReactTooltip from 'react-tooltip';

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


const GfiTabContent = ({
    data,
    title,
    tablePropsInit,
}) => {
    const [tableProps, changeTableProps] = useState(tablePropsInit);
    const { filteringInfo, filters } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);

    const dispatch = action => {
      changeTableProps(prevState => kaReducer(prevState, action));
    };

    useEffect(() => {
        changeTableProps(tablePropsInit);
    }, [tablePropsInit]);
    const [showDataTable, setShowDataTable] = useState(false);

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

    const activeFilteringOnLayer = useCallback(() => {
        return filters.some(filter => (filter.layer ===  data.layerId))
    })

    const [isActiveFiltering, setIsActiveFiltering] = useState(false);

    const [isFiltering, setIsFiltering] = useState(false);//if filtering possible for layer

    useEffect(() => {
        setIsActiveFiltering(activeFilteringOnLayer());
      }, [filters, activeFilteringOnLayer]);

    useEffect(() => {
        setIsFiltering(tablePropsInit?.filterableColumns.length === 0 ? false : true);
    }, [tablePropsInit])

    return <>
            <StyledSelectedTabHeader>
                <ReactTooltip backgroundColor={theme.colors.mainColor1} textColor={theme.colors.mainWhite} disable={isMobile} id={"gfiFilter"} place="bottom" type='dark' effect="float">
                    <span>{strings.gfifiltering.filter}</span>
                </ReactTooltip>
                <StyledSelectedTabTitle>
                    <p>
                        {
                            title.toUpperCase()
                        }
                    </p>
                </StyledSelectedTabTitle>
                <StyledSelectedTabDisplayOptionsButton
                    onClick={() =>  store.dispatch(setFilteringInfo( {modalOpen: true, layer: { id: data.layerId, title: title, tableProps : tableProps }} ))}
                    data-tip data-for={'gfiFilter'}
                >
                    {isFiltering && <FontAwesomeIcon icon={faFilter} style={{ color: filters && isActiveFiltering ? theme.colors.secondaryColor8 : theme.colors.mainColor1 }}  />}
                    {filteringInfo?.title && filters && activeFilteringOnLayer() && 
                    <FontAwesomeIcon
                        icon={faExclamation}
                        style={{
                            color: 'red',
                            marginLeft: '10px',
                            }}/
                    >
                    }
                </StyledSelectedTabDisplayOptionsButton>
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
                        data?.content?.map((cont, contentIndex) => {
                            return cont.geojson?.features?.map((feature, index) => {
                                if (filterFeature(feature)) {
                                    return <GfiTabContentItem
                                            key={feature.id}
                                            title={feature.id.split('.')[1] ? title + ` | ${strings.gfi.uniqueId } ` + feature.id.split('.')[1] : title + ' ' + feature.id}
                                            data={feature}
                                            index={index}
                                            contentIndex={contentIndex}
                                            selectFeature={selectFeature}
                                            deSelectFeature={deSelectFeature}
                                        />
                                }
                            })
                        })
                    }
                </StyledTabContent>
  
            </div>

        }
    </>
};

export default GfiTabContent;