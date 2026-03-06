import { useContext } from 'react';
import { ReactReduxContext } from "react-redux";
import Dialog from '../../dialog/Dialog';
import { useAppSelector } from "../../../state/hooks";
import strings from "../../../translations";
import FeatureDataSelectionToolsMenu from "../tools/FeatureDataSelectionToolsMenu";
import { setIsGfiToolsOpen, setActiveSelectionTool, setMinimizeFeatureSelection, setSelectedDrawingTool } from "../../../state/slices/uiSlice";
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { FEATURE_SELECTION_DRAWING_TOOL, FEATURE_SELECTION_LAYER } from '../../../utils/constants';
import { toast } from 'react-toastify';

const FeatureDataToolsDialog = () => {
  const { isGfiToolsOpen, minimizeFeatureSelection, activeTool } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);
  let { channel } = useAppSelector((state) => state.rpc);

  const handleCloseGfiLocations = () => {
    // Make sure drawing is stopped and cleared
    channel &&
      activeTool === FEATURE_SELECTION_DRAWING_TOOL &&
      channel.postRequest('DrawTools.StopDrawingRequest', [
        FEATURE_SELECTION_DRAWING_TOOL,
        true
      ]);

    setIsGfiToolsOpen &&
      channel &&
      channel.postRequest('VectorLayerRequest', [
        {
          layerId: FEATURE_SELECTION_LAYER,
          remove: true
        }
      ]);

    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(setSelectedDrawingTool(null));
    store.dispatch(setIsGfiToolsOpen(false));
    // dismiss measurement toast as drawing is not active anymore
    toast.dismiss('measurementToast');
  };

  return isGfiToolsOpen ? (
    <Dialog
      drag={true}
      resize={true}
      fullScreenOnMobile={true}
      title={strings.gfi.featureSelection.title}
      type={"normal"}
      closeAction={handleCloseGfiLocations}
      titleIcon={faObjectGroup}
      minimize={minimizeFeatureSelection}
      minimizable={true}
      minimizeAction={() => store.dispatch(setMinimizeFeatureSelection(true))}
      id="gfi_tools_menu_dialog"
    >
      <FeatureDataSelectionToolsMenu/>
    </Dialog>
  )
  : null ;
};

export default FeatureDataToolsDialog;
