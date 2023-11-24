import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { motion, AnimatePresence } from 'framer-motion';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../state/hooks';

import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

const listVariants = {
    visible: {
        height: 'auto',
        opacity: 1,
    },
    hidden: {
        opacity: 0,
        height: 0,
    },
};

const StyledGFITablesContainer = styled(motion.div)`
    border-top: 1px solid #ddd;
    cursor: pointer;
`;

const StyledInfoHeader = styled(motion.div)`
    color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledInfoHeaderDiv = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px;
    font-weight: bold;
    svg {
        color: ${(props) => props.theme.colors.mainColor1};
        font-size: 19px;
        transition: all 0.3s ease-out;
    }
`;

const StyledInfoHeaderIconContainer = styled(motion.div)``;

const StyledLowPriorityDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
`;

const StyledHighPriorityDiv = styled.div`
    margin-left: 1rem;
    tbody {
        overflow: auto;
    }
`;

const StyledLowPriorityTableContainer = styled(motion.div)`
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    tbody {
        overflow: auto;
    }
`;

const StyledFeature = styled(motion.div)`
    overflow: hidden;
`;

const StyledGfiTr = styled.tr``;

const StyledGfiTd = styled.td``;

const StyledGfiTable = styled.table``;

const StyledGfiTableBody = styled.tbody``;

const StyledGfiResponseWrapper = styled.div`
    overflow: auto;
`;

export const FormattedGFI = ({ data, isDataTable }) => {
    const { channel } = useAppSelector((state) => state.rpc);
    let geoJSON = {...data};
    let pretty = [];

    // if we want to show the normal dropdown list view
    if (!isDataTable) {
        const getKey = (properties) => {
            const keys = Object.keys(properties);
            const values = [];
            keys.forEach(key => {
                if (key !== '_order' && key !== '_orderHigh') {
                    values.push(key + '_' + properties[key]);
                }
            });
            return values.join('-');
        };

        geoJSON.forEach((geom, index) => {
            geom.features.forEach((f, index) => {
                const keys = Object.keys(f.properties);
                let highPriorityRows = [];
                let lowPriorityRows = [];
                const visibleFields =
                    f.properties._order && !Array.isArray(f.properties._order)
                        ? JSON.parse(f.properties._order.replace('\\', ''))
                        : f.properties._order && Array.isArray(f.properties._order)
                        ? f.properties._order
                        : [];
                const highPriority =
                    f.properties._orderHigh && !Array.isArray(f.properties._orderHigh)
                        ? JSON.parse(f.properties._orderHigh.replace('\\', ''))
                        : f.properties._orderHigh &&
                          Array.isArray(f.properties._orderHigh)
                        ? f.properties._orderHigh
                        : [];
                const generatedKey = getKey(f.properties);
                keys.forEach((key) => {
                    if (key !== '_order' && key !== '_orderHigh' && key !== 'UID') {
                        getContent(
                            key,
                            f.properties[key],
                            visibleFields,
                            highPriority,
                            lowPriorityRows,
                            highPriorityRows,
                            generatedKey
                        );
                    }
                });
    
                pretty.push(
                    <GFITables
                        key={'gfi-table-' + generatedKey}
                        index={index}
                        lowPriorityRows={lowPriorityRows}
                        highPriorityRows={highPriorityRows}
                        geoJSON={geom}
                        generatedKey={generatedKey}
                        channel={channel}
                    />
                );
            });
        })

        return (
            <>
                {pretty.map((table) => {
                    return (
                        <StyledGfiResponseWrapper key={'gfi-popup-wrapper-' + table.key}>
                            {table}
                        </StyledGfiResponseWrapper>
                    )
                })}
            </>
        );
    } else {
        const propertiesData = [];
        var columns = [];
        var additionalColumns = [];

        const properties = geoJSON[0].features[0].properties;
        const highPriorityFields =
            properties._orderHigh && !Array.isArray(properties._orderHigh)
            ? JSON.parse(properties._orderHigh.replace('\\',''))
            : properties._orderHigh && Array.isArray(properties._orderHigh)
            ? properties._orderHigh
            : [];
        const visibleFields =
            properties._order && !Array.isArray(properties._order)
            ? JSON.parse(properties._order.replace('\\',''))
            : properties._order && Array.isArray(properties._order)
            ? properties._order
            : [];

        geoJSON.forEach((geom, index) => {
            geom.features.forEach((f, index) => {
                let rows = {};
                const keys = Object.keys(f.properties);
                keys.forEach(key => {
                    if (key !== '_order' && key !== '_orderHigh' && key !== 'UID') {
                        getDataTableContent(key, f.properties[key], rows, geoJSON, index);
                    }
                });
                propertiesData.push(rows);
            });
        })

        //set column options
        visibleFields.forEach(field => {
            const additionalColumn = {name: field, selector: row => row.fields[field], sortable: true};
            additionalColumns.push(additionalColumn);
        });

        highPriorityFields.forEach(field => {
            const column = {name: field, selector: row => row.fields[field], sortable: true};
            columns.push(column);
        });

        //combine columns, this way we can control the high and low priority rows separately
        const combinedColumns = columns.concat(additionalColumns);
        pretty.push(dataTable(combinedColumns, propertiesData, channel));

        return (
            <>
                {pretty}
            </>
        );
    };
}

const dataTable = (columns, data, channel) => {
    const tableData = {
      columns,
      data
    };

    return (
      <div className="main" style={{userSelect: "text", overflow: "scroll"}}>
        <DataTableExtensions
            {...tableData}
            filterDigit={0}
            filterPlaceholder={strings.gfi.search}
            export={false}
            print={false}
        >
            <DataTable
                columns={columns}
                data={data}
                noHeader
                defaultSortAsc={false}
                selectableRows={true}
                selectableRowsHighlight={true}
                onSelectedRowsChange={selectedRows => selectRow(selectedRows, channel)}
                pagination
                striped
                highlightOnHover
            />
        </DataTableExtensions>
      </div>
    );
  }

//highlight selected features on map
//FIX
const selectRow = ({ selectedRows}, channel ) => {
    deSelectFeature(channel);
    let features = [];
    selectedRows.forEach((row) => {
        const index = row.index;
        const feature = row.geoJSON.features[index];
        features.push(feature);
    });
    selectFeature(channel, features);
  }

//get data values without _order and _orderHigh rows, make url values into links
const getDataTableContent = (key, value, rows, geoJSON, index) => {
    value = (value && typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) ? <a href={value} target="_blank" rel="noreferrer">{value}</a> : value;

    if (value !== null && typeof value === 'string' && value.trim() === '') {
        return;
    }
    // try if value is JSON
    try {
        const json = JSON.parse(value.replace(/'/g, '"'));
        // if array
        if (Array.isArray(json)) {
            value = '';
            json.forEach(val => {
                value += " " + val;
            });
        }
    } catch (err) {
        // not json
    }
    //add geojson and index so we can later access features to highlight them on map
    rows.geoJSON = geoJSON;
    rows.index = index;
    if (!rows.fields) {
        rows.fields = {};
    }
    rows.fields[key] = value;

};

const getContent = (key, value, visibleFields, highPriorityFields, lowPriorityRows, highPriorityRows, generatedKey) => {
    const hasConfiguration = highPriorityFields.length !== 0 || visibleFields.length !== 0;
    value = (value && typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) ? '<a href="' + value + '" target="_blank">' + value + '<a>' : value;

    if (value !== null && typeof value === 'string' && value.trim() === '') {
        return;
    }
    // try if value is JSON
    try {
        const json = JSON.parse(value.replace(/'/g, '"'));
        // if array
        if (Array.isArray(json)) {
            value = '';
            json.forEach((val) => {
                value += '<div>' + val + '</div>';
            });
        }
    } catch (err) {
        // not json
    }
    if (hasConfiguration && highPriorityFields.includes(key)) {
        highPriorityRows.push(
            <StyledGfiTr key={'hr-' + generatedKey + key + '-' + value}>
                <StyledGfiTd>{key}</StyledGfiTd>
                <StyledGfiTd
                    dangerouslySetInnerHTML={{ __html: value }}
                ></StyledGfiTd>
            </StyledGfiTr>
        );
        return;
    } else if (hasConfiguration && visibleFields.includes(key)) {
        lowPriorityRows.push(
            <StyledGfiTr key={'lr-' + generatedKey + key + '-' + value}>
                <StyledGfiTd>{key}</StyledGfiTd>
                <StyledGfiTd
                    dangerouslySetInnerHTML={{ __html: value }}
                ></StyledGfiTd>
            </StyledGfiTr>
        );
        return;
    }
    lowPriorityRows.push(
        <StyledGfiTr key={'rr-' + generatedKey + key + '-' + value}>
            <StyledGfiTd>{key}</StyledGfiTd>
            <StyledGfiTd
                dangerouslySetInnerHTML={{ __html: value }}
            ></StyledGfiTd>
        </StyledGfiTr>
    );
};

const selectFeature = (channel, features) => {
    let featureStyle = {
        fill: {
          color: "#e50083",
        },
        stroke: {
          color: "#e50083",
          width: 5,
          lineDash: "solid",
          lineCap: "round",
          lineJoin: "round",
          area: {
            color: "#e50083",
            width: 4,
            lineJoin: "round",
          },
        },
        image: {
            shape: 2,
            size: 5,
            offsetX: 13,
            offsetY: 7,
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

const GFITables = ({
    index,
    lowPriorityRows,
    highPriorityRows,
    geoJSON,
    generatedKey,
    channel
    }) => {

    const highPriorityTableExists = highPriorityRows.length > 0 ? false : true;
    const [isFeatureOpen, openFeature] = useState(false);
    const [isInfoOpen, openInfo] = useState(highPriorityTableExists);
    const  [isHovered, setHovered] = useState(false);

    return (
            <StyledGFITablesContainer
                key={'gfi-tables-' + generatedKey}
                onHoverStart={() => {
                    selectFeature(channel, [geoJSON.features[index]]);
                    setHovered(true);
                }}
                onHoverEnd={() => {
                    deSelectFeature(channel, [geoJSON.features[index]]);
                    setHovered(false);
                }}
            >
            <StyledInfoHeaderDiv
                onClick={() => openFeature(!isFeatureOpen)}
                isFeatureOpen={isFeatureOpen}
                animate={{
                    backgroundColor: isHovered ? '#f0f0f0' : '#ffffff',
                }}
            >
                <StyledInfoHeader
                    animate={{
                        backgroundColor: isHovered ? '#f0f0f0' : '#ffffff',
                    }}
                >
                    {strings.gfi.target + ' ' + (index + 1)}
                </StyledInfoHeader>
                <StyledInfoHeaderIconContainer
                    animate={{
                        transform: isFeatureOpen
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                    }}
                >
                    <FontAwesomeIcon icon={faAngleDown} />
                </StyledInfoHeaderIconContainer>
            </StyledInfoHeaderDiv>
            <AnimatePresence>
                {isFeatureOpen && (
                    <StyledFeature
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            type: 'tween',
                        }}
                    >
                        {!highPriorityTableExists ? (
                            <StyledHighPriorityDiv>
                                <StyledGfiTable>
                                    <StyledGfiTableBody>
                                        {highPriorityRows}
                                    </StyledGfiTableBody>
                                </StyledGfiTable>
                            </StyledHighPriorityDiv>
                        ) : null}

                        <StyledLowPriorityDiv>
                            {!highPriorityTableExists ? (
                                <StyledInfoHeaderDiv
                                    onClick={() => openInfo(!isInfoOpen)}
                                >
                                    <StyledInfoHeader>
                                        {strings.gfi.additionalInfo}
                                    </StyledInfoHeader>
                                    <StyledInfoHeaderIconContainer
                                        animate={{
                                            transform: isInfoOpen
                                                ? 'rotate(180deg)'
                                                : 'rotate(0deg)',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </StyledInfoHeaderIconContainer>
                                </StyledInfoHeaderDiv>
                            ) : null}
                            <StyledLowPriorityTableContainer
                                initial={isInfoOpen}
                                animate={isInfoOpen ? 'visible' : 'hidden'}
                                variants={listVariants}
                                transition={{
                                    duration: 0.1,
                                }}
                            >
                                <StyledGfiTable>
                                    <StyledGfiTableBody>
                                        {lowPriorityRows}
                                    </StyledGfiTableBody>
                                </StyledGfiTable>
                            </StyledLowPriorityTableContainer>
                        </StyledLowPriorityDiv>
                    </StyledFeature>
                )}
            </AnimatePresence>
        </StyledGFITablesContainer>
    );
};

export default FormattedGFI;
