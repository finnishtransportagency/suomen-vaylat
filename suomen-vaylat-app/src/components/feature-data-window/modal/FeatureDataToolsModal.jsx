import { useContext } from 'react';
import { ReactReduxContext } from "react-redux";
import Modal from '../../modals/Modal';
import { useAppSelector } from "../../../state/hooks";
import strings from "../../../translations";
import GfiToolsMenu from "../GfiToolsMenu";
import { setIsGfiToolsOpen, setIsGfiDownloadToolsOpen, setActiveSelectionTool } from "../../../state/slices/uiSlice";

const FeatureDataToolsModal = ({ constraintsRef }) => {
  const { isGfiToolsOpen, isGfiDownloadToolsOpen } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);
  let { channel } = useAppSelector((state) => state.rpc);

  const handleCloseGfiLocations = () => {
    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(setIsGfiToolsOpen(false));
  };

  const handleGfiToolsMenu = () => {
    store.dispatch(setIsGfiToolsOpen(false));
    channel &&
      channel.postRequest("DrawTools.StopDrawingRequest", [
        "gfi-selection-tool",
        true,
      ]);

    isGfiToolsOpen &&
      channel &&
      channel.postRequest("VectorLayerRequest", [
        {
          layerId: "download-tool-layer",
          remove: true,
        },
      ]);
    store.dispatch(setActiveSelectionTool(null));
    setIsGfiDownloadToolsOpen(!isGfiDownloadToolsOpen);
  };

  return (
    <Modal
      constraintsRef={constraintsRef}
      drag={true}
      resize={true}
      backdrop={false}
      fullScreenOnMobile={true}
      title={strings.gfi.selectLocations}
      type={"normal"}
      closeAction={handleCloseGfiLocations}
      isOpen={isGfiToolsOpen}
      id="gfi_tools_menu_modal"
    >
      <GfiToolsMenu
        handleGfiToolsMenu={handleGfiToolsMenu}
        closeButton={false}
      />
    </Modal>
  );
};

export default FeatureDataToolsModal;
