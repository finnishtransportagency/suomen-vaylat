import React, { useContext } from 'react';
import { faFilter, faExpand, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import Badge from '../../badges/Badge';
import { setFilters, setFilteringInfo } from '../../../state/slices/rpcSlice';
import {
  setIsFilterDialogOpen,
  setMinimizeFilterDialog,
  setMaximizeFilterDialog
} from '../../../state/slices/uiSlice';
import { theme } from '../../../theme/theme';
import strings from '../../../translations';

const LayerFilterBadge = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel, filteringInfo, filters } = useAppSelector(
    (state) => state.rpc
  );

  const handleCloseFilterDialog = () => {
    filteringInfo.forEach((filteringInfo) => {
      filters.length > 0 &&
        filteringInfo.layer &&
        channel &&
        channel.postRequest('MapModulePlugin.MapLayerUpdateRequest', [
          filteringInfo.layer.id,
          true,
          { CQL_FILTER: null }
        ]);
    });
    store.dispatch(setIsFilterDialogOpen(false));
    store.dispatch(setMinimizeFilterDialog({ minimized: false }));
    store.dispatch(setMaximizeFilterDialog(false));
    store.dispatch(setFilters([]));
    store.dispatch(setFilteringInfo([]));
  };

  return (
    <Badge
      icon={<FontAwesomeIcon icon={faFilter} />}
      title={strings.gfi.filterBadgeTitle}
      bg={theme.colors.secondaryColorPink}
      actionButtons={[
        <div
          key="expand"
          onClick={() =>
            store.dispatch(setMinimizeFilterDialog({ minimized: false }))
          }
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faExpand} />
        </div>
      ]}
      closeAction={handleCloseFilterDialog}
    />
  );
}

export default LayerFilterBadge;
