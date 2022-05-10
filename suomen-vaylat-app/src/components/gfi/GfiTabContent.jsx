import { useState, useEffect } from 'react';
import styled from 'styled-components';

import DataTable from "react-data-table-component";

import GfiTabContentItem from './GfiTabContentItem';

const StyledGfiTabContentContainer = styled.div`
    overflow: auto;
`;

const customStyles = {
    rows: {
        style: {
            '&:hover': {
                backgroundColor: '#f0f0f0',
              },
        },
    },
    headCells: {
        style: {
            fontSize: '14px',
            fontWeight: '600',
        },
    },
    cells: {
        style: {
            color: '#646464',
        },
    },
};

const GfiTabContent = ({
    data,
    showDataTable
}) => {
    const [tableColumns, setTableColumns] = useState([]);
    const [tableCells, setTableCells] = useState([]);

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

    return <StyledGfiTabContentContainer>
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
            data.content && data.content.features && data.content.features.map((feature, index) => {
                return <GfiTabContentItem
                    key={feature.id}
                    data={feature}
                    index={index}
                    selectFeature={selectFeature}
                    deSelectFeature={deSelectFeature}
                />
            })
        }
    </StyledGfiTabContentContainer>
};

export default GfiTabContent;