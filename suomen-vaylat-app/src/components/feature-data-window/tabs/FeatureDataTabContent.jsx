import { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import FeatureDataTabContentItem from './FeatureDataTabContentItem';
import strings from '../../../translations';
import { ReactReduxContext } from 'react-redux';
import { faTable, faList, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../../state/hooks';
import { setFilteringInfo } from '../../../state/slices/rpcSlice';
import { Table } from 'ka-table';
import 'ka-table/style.scss';
import { theme, isMobile } from '../../../theme/theme';
import ReactTooltip from 'react-tooltip';
import { setMinimizeFilterDialog } from '../../../state/slices/uiSlice';
import { isValidUrl } from '../../../utils/validUrlUtil';
import { SortingMode, PagingPosition } from 'ka-table/enums';

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
  }
`;

const StyledTabContent = styled.div`
  overflow: auto;
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

function flattenFeatureForTable(feature) {
  // For ka-table: unwrap properties or geojson up to top-level keys
  if (feature.properties) {
    return { ...feature.properties, id: feature.id };
  }
  if (feature.geojson) {
    return { ...feature.geojson, id: feature.id };
  }
  return feature;
}

function getColumnsFromRow(row) {
  if (!row) return [];
  // Remove typical non-field keys, you can expand this list as needed
  return Object.keys(row)
    .filter((k) => k !== 'id' && k !== 'UID')
    .map((key) => ({
      key,
      title: key,
      width: 180,
      colGroup: { style: { minWidth: 120 } }
    }));
}

function tablePropsInit(inputFeatures) {
  const rows = Array.isArray(inputFeatures) ? inputFeatures : [];
  const flatRows = rows.map(flattenFeatureForTable);

  let columnsArray = [];
  if (flatRows.length > 0) {
    columnsArray = getColumnsFromRow(flatRows[0]);
  }

  return {
    columns: columnsArray,
    filterableColumns: columnsArray,
    filteredFeatures: rows, // For the card/list rendering
    data: flatRows, // For ka-table
    rowKeyField: 'id',
    sortingMode: SortingMode.SingleTripleState,
    columnResizing: true,
    paging: {
      enabled: true,
      pageIndex: 0,
      pageSize: 100,
      pageSizes: [10, 50, 100],
      position: PagingPosition.Bottom
    },
    format: ({ value }) => {
      if (isValidUrl(value)) {
        return (
          <a target="_blank" rel="noreferrer" href={value}>
            {value}
          </a>
        );
      } else if (typeof value === 'string') {
        return (
          <span>
            {value.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </span>
        );
      }
      return value;
    }
  };
}

const FeatureDataTabContent = ({
  layer,
  title,
  tablePropsInit: inputTablePropsInit
}) => {
  const { filteringInfo, filters } = useAppSelector((state) => state.rpc);
  const { store } = useContext(ReactReduxContext);
  const { minimizeFilter } = useAppSelector((state) => state.ui);

  const [showDataTable, setShowDataTable] = useState(false);

  // Decide whether to use the passed-in tablePropsInit or build from features:
  const features = inputTablePropsInit?.filteredFeatures || [];
  const tableProps = tablePropsInit(features);

  const selectFeature = (channel, features) => {
    let featureStyle = {
      fill: {
        color: theme.colors.secondaryColorPink
      },
      stroke: {
        color: theme.colors.secondaryColorPink,
        width: 5,
        lineDash: 'solid',
        lineCap: 'round',
        lineJoin: 'round',
        area: {
          color: theme.colors.secondaryColorPink,
          width: 4,
          lineJoin: 'round'
        }
      },
      image: {
        shape: 2,
        size: 5,
        fill: {
          color: theme.colors.secondaryColorPink
        }
      }
    };

    let options = {
      featureStyle: featureStyle,
      layerId: 'gfi-result-layer-overlay',
      animationDuration: 200,
      clearPrevious: true
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

    channel.postRequest(rn, [geojsonObject, options]);
  };

  const deSelectFeature = (channel) => {
    channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
      null,
      null,
      'gfi-result-layer-overlay'
    ]);
  };

  const activeFilteringOnLayer = useCallback(() => {
    return filters.some((filter) => filter.layer === layer.id);
  }, [filters, layer.id]);

  const [isActiveFiltering, setIsActiveFiltering] = useState(false);

  const [isFiltering, setIsFiltering] = useState(false); //if filtering possible for layer

  useEffect(() => {
    setIsActiveFiltering(activeFilteringOnLayer());
  }, [filters, activeFilteringOnLayer]);

  useEffect(() => {
    setIsFiltering(tableProps?.filterableColumns?.length > 0);
  }, [tableProps]);

  const handleFilterClick = () => {
    if (!filteringInfo.some((f) => f.layer.id === layer.id)) {
      if (filteringInfo.filter((f) => f.layer.id === layer.id).length === 0) {
        var filterColumnsArray = [];
        layer.config?.gfi?.filterFields &&
          layer.config?.gfi?.filterFields.forEach((column) => {
            if (column.field && column.type) {
              filterColumnsArray.push({
                key: column.field,
                title: column.field,
                type: column.type,
                default: column.default || false
              });
            }
          });

        const updateFilter = [...filteringInfo];
        updateFilter.push({
          dialogOpen: true,
          layer: {
            id: layer.id,
            title: layer.name,
            filterFieldsInfo: layer.config?.gfi?.filterFieldsInfo || null,
            filterColumnsArray: filterColumnsArray
          }
        });
        store.dispatch(setFilteringInfo(updateFilter));
      }
    }
    minimizeFilter &&
      store.dispatch(
        setMinimizeFilterDialog({ minimized: false, layer: layer.id })
      );
  };

  return (
    <>
      <StyledSelectedTabHeader>
        <StyledSelectedTabTitle>
          <p>{title.toUpperCase()}</p>
        </StyledSelectedTabTitle>
        {isFiltering && (
          <StyledSelectedTabDisplayOptionsButton
            onClick={handleFilterClick}
            data-tip
            data-for={'gfiFilter'}
          >
            <ReactTooltip
              backgroundColor={theme.colors.mainColor1}
              textColor={theme.colors.mainWhite}
              disable={isMobile}
              id={'gfiFilter'}
              place="bottom"
              type="dark"
              effect="float"
            >
              <span>{strings.gfifiltering.filter}</span>
            </ReactTooltip>
            <FontAwesomeIcon
              icon={faFilter}
              style={{
                color:
                  filters && isActiveFiltering
                    ? theme.colors.secondaryColorPink
                    : theme.colors.mainColor1
              }}
            />
          </StyledSelectedTabDisplayOptionsButton>
        )}
        <StyledSelectedTabDisplayOptionsButton
          onClick={() => setShowDataTable(!showDataTable)}
        >
          <FontAwesomeIcon icon={showDataTable ? faList : faTable} />
        </StyledSelectedTabDisplayOptionsButton>
      </StyledSelectedTabHeader>

      {showDataTable ? (
        <Table {...tableProps} />
      ) : (
        <StyledTabContent>
          {features.map((feature, index) => {
            // Compose key and title for card view:
            let showTitle = feature.id || `${title} #${index}`;
            // Try to extract a uniqueId from id strings of type "blabla.123"
            if (
              feature.id &&
              Array.isArray(feature.id.split('.')) &&
              feature.id.split('.')[1]
            ) {
              showTitle =
                title +
                ` | ${strings.gfi.uniqueId} ` +
                feature.id.split('.')[1];
            } else {
              showTitle = title + ' ' + (feature.id || index + 1);
            }
            return (
              <FeatureDataTabContentItem
                key={feature.id || index}
                title={showTitle}
                data={feature}
                index={index}
                contentIndex={index}
                selectFeature={selectFeature}
                deSelectFeature={deSelectFeature}
              />
            );
          })}
        </StyledTabContent>
      )}
    </>
  );
};

export default FeatureDataTabContent;
