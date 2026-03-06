import Dialog from '../../dialog/Dialog';
import { LayerFilterContainer } from '../LayerFilterContainer';
import strings from '../../../translations';
import { useContext, useMemo } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from "../../../state/hooks";

import {
  setFilters,
  setFilteringInfo,
} from "../../../state/slices/rpcSlice";

import {
  setIsFilterDialogOpen,
  setMinimizeFilterDialog,
  setMaximizeFilterDialog
} from "../../../state/slices/uiSlice";

const LayerFilterDialog = () => {
  const { store } = useContext(ReactReduxContext);
  const { filteringInfo, filters } = useAppSelector((state) => state.rpc);
  const { channel } = useAppSelector((state) => state.rpc);
  const {
    minimizeFilter,
    maximizeFilter
  } = useAppSelector((state) => state.ui);

  const isFilterDialogOpen = useMemo(
      () => filteringInfo.some((f) => f.dialogOpen),
      [filteringInfo]
    );

  const handleCloseFilterDialog = () => {
    // reset map
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

    // reset states
    store.dispatch(setIsFilterDialogOpen(false));
    store.dispatch(setMinimizeFilterDialog({ minimized: false }));
    store.dispatch(setMaximizeFilterDialog(false));
    store.dispatch(setFilters([]));
    store.dispatch(setFilteringInfo([]));
  };

  return isFilterDialogOpen ? (
    <Dialog
      id="filter_dialog_container"
      drag={true} /* Enable (true) or disable (false) drag */
      resize={true}
      fullScreenOnMobile={
        true
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={strings.gfi.filter} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={
        handleCloseFilterDialog
      } /* Action when pressing dialog close button or backdrop */
      minimize={minimizeFilter.minimized}
      maximize={maximizeFilter}
      minimizable={true}
      maximizable={true}
      minimizeAction={() =>
        store.dispatch(
          setMinimizeFilterDialog({ minimized: !minimizeFilter.minimized })
        )
      }
      maximizeAction={() =>
        store.dispatch(setMaximizeFilterDialog(!maximizeFilter))
      }
      maxWidth={maximizeFilter ? null : '40em'}
      minWidth={'25em'}
      minHeight={'30em'}
    >
      <LayerFilterContainer />
    </Dialog>
  )
  : null ;
};

export default LayerFilterDialog;
