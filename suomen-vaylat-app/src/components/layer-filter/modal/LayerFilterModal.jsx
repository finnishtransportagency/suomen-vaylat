import Modal from '../../modals/Modal';
import { LayerFilterContainer } from '../LayerFilterContainer';
import strings from '../../../translations';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from "../../../state/hooks";

import {
  setFilters,
  setFilteringInfo,
} from "../../../state/slices/rpcSlice";

import {
  setIsFilterModalOpen,
  setMinimizeFilterModal,
  setMaximizeFilterModal
} from "../../../state/slices/uiSlice";

const LayerFilterModal = ({ constraintsRef }) => {
  const { store } = useContext(ReactReduxContext);
  const { filteringInfo, filters } = useAppSelector((state) => state.rpc);
  const { channel } = useAppSelector((state) => state.rpc);
  const {
    minimizeFilter,
    maximizeFilter
  } = useAppSelector((state) => state.ui);

  const handleCloseFilterModal = () => {
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
    store.dispatch(setIsFilterModalOpen(false));
    store.dispatch(setMinimizeFilterModal({ minimized: false }));
    store.dispatch(setMaximizeFilterModal(false));
    store.dispatch(setFilters([]));
    store.dispatch(setFilteringInfo([]));
  };

  return (
    <Modal
      id="filter_modal_container"
      constraintsRef={{
        constraintsRef
      }} /* Reference div for modal drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={true}
      backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        true
      } /* Scale modal full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={strings.gfi.filter} /* Modal header title */
      type={'normal'} /* Modal type */
      closeAction={
        handleCloseFilterModal
      } /* Action when pressing modal close button or backdrop */
      isOpen={filteringInfo.some((f) => f.modalOpen)} /* Modal state */
      minimize={minimizeFilter.minimized}
      maximize={maximizeFilter}
      minimizable={true}
      maximizable={true}
      minimizeAction={() =>
        store.dispatch(
          setMinimizeFilterModal({ minimized: !minimizeFilter.minimized })
        )
      }
      maximizeAction={() =>
        store.dispatch(setMaximizeFilterModal(!maximizeFilter))
      }
      maxWidth={maximizeFilter ? null : '40em'}
      minWidth={'25em'}
      minHeight={'30em'}
      overflow={'auto'}
    >
      <LayerFilterContainer />
    </Modal>
  );
};

export default LayerFilterModal;
