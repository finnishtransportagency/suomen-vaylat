import { useState, useEffect } from 'react';
import styled from 'styled-components';

import DataTable from "react-data-table-component";

import GfiTabContentItem from './GfiTabContentItem';

import { faTable, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
    position: absolute;
    right: 0px;
    padding: 8px;
    cursor: pointer;
    color: ${(props) => props.theme.colors.mainColor1};
    svg {
        font-size: 24px;
    };
`;

const customStyles = {
    rows: {
        style: {
            whiteSpace: 'unset',
            overflow: 'unset',
            textOverflow: 'unset',
            '&:hover': {
                backgroundColor: '#f0f0f0',
                'div *': {
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'unset',
                  }
              },
        },
    },
    headCells: {
        style: {
            fontSize: '14px',
            fontWeight: '600',
            'div *': {
                whiteSpace: 'unset',
                overflow: 'unset',
                textOverflow: 'unset'
            }
        },
    },
    cells: {
        style: {
            color: '#646464',
            userSelect: 'text'
        },
    },
};

const GfiTabContent = ({
    data,
    title
}) => {

    const [tableColumns, setTableColumns] = useState([]);
    const [tableCells, setTableCells] = useState([]);

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

    useEffect(() => {
        const properties = data && data.content && data.content.features && data.content.features[0].properties;

        var hightPriorityColumns = properties._orderHigh && JSON.parse(properties._orderHigh);
        var lowPriorityColumns = properties._order && JSON.parse(properties._order);

        var columns = hightPriorityColumns.concat(lowPriorityColumns);
        var cells = data && data.content && data.content.features && data.content.features.map(feature => {
                var cell = {...feature.properties};
                cell['id'] = feature.id;
                cell.hasOwnProperty('_orderHigh') && delete cell['_orderHigh'];
                cell.hasOwnProperty('_order') && delete cell['_order'];
                return cell;
        });

        setTableColumns(columns.map(property => {
                  return property !== 'UID' && {
                  name: property,
                  selector: row => row[property],
                  sortable: true,
              }
        }));

         setTableCells(cells);
    },[data]);

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
                    onClick={() => setShowDataTable(!showDataTable)}
                >
                    <FontAwesomeIcon icon={showDataTable ? faList : faTable} />
                </StyledSelectedTabDisplayOptionsButton>
            </StyledSelectedTabHeader>

        {
             showDataTable ?
                <DataTable
                    columns={tableColumns}
                    data={tableCells}
                    fixedHeader
                    fixedHeaderScrollHeight="100%"
                    customStyles={customStyles}
                />
            :
            <div style={{
                overflow: 'auto'
            }}>
                {
                                data.content && data.content.features && data.content.features.map((feature, index) => {
                                    return <GfiTabContentItem
                                        key={feature.id}
                                        title={feature.id.split(".")[1] ? title+" "+feature.id.split(".")[1] : title+" "+feature.id}
                                        data={feature}
                                        index={index}
                                        selectFeature={selectFeature}
                                        deSelectFeature={deSelectFeature}
                                    />
                                })
                }
            </div>

        }
    </>
};

export default GfiTabContent;