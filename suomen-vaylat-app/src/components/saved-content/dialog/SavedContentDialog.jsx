import { useContext } from "react";
import Dialog from '../../dialog/Dialog';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from "../../../state/hooks";
import strings from "../../../translations";
import SavedContent from "../SavedContent";
import { setIsSaveViewOpen, setSavedTab, setShowSavedContentViewForm, setShowSavedContentGeometryForm } from "../../../state/slices/uiSlice";
import { ReactReduxContext } from "react-redux";
import { theme } from "../../../theme/theme";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SavedContentDialog = ({ constraintsRef }) => {
  const { isSaveViewOpen } = useAppSelector((state) => state.ui);
  const { isLoggedIn } = useAppSelector((state) => state.rpc);
  const { store } = useContext(ReactReduxContext);

  const handleCloseSaveViewDialog = () => {
    store.dispatch(setIsSaveViewOpen(false));
    store.dispatch(setShowSavedContentGeometryForm(false));
    store.dispatch(setShowSavedContentViewForm(false));
    store.dispatch(setSavedTab(null));
  };

  const viewHelp = () => (
    <ul>
      <li>{strings.savedContent.saveView.saveViewDescription1}</li>
      <li>{strings.savedContent.saveView.saveViewDescription2}</li>
    </ul>
  );

  const isLowResScreen = window.matchMedia(theme.device.lowResDesktop).matches;

  return (
    <Dialog
      constraintsRef={constraintsRef}
      drag={true}
      resize={false}
      backdrop={false}
      fullScreenOnMobile={true}
      titleIcon={isLoggedIn ? <AccountCircleIcon sx={{fontSize: "24px !important"}} /> : faSave}
      title={strings.savedContent.savedContent}
      type={"normal"}
      closeAction={handleCloseSaveViewDialog}
      isOpen={isSaveViewOpen}
      id="saved_content_dialog"
      minWidth={"600px"}
      minHeight={isLowResScreen ? "600px" : "700px"}
      hasHelp={true}
      helpId={"show_view_help"}
      helpContent={viewHelp()}
    >
      <SavedContent />
    </Dialog>
  );
};

export default SavedContentDialog;
