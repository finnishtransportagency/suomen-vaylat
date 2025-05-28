import { useContext } from "react";
import Dialog from '../../dialog/Dialog';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from "../../../state/hooks";
import strings from "../../../translations";
import SavedContent from "../SavedContent";
import { setIsSaveViewOpen } from "../../../state/slices/uiSlice";
import { ReactReduxContext } from "react-redux";

const SavedContentDialog = ({ constraintsRef }) => {
  const { isSaveViewOpen } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  const handleCloseSaveViewDialog = () => {
    store.dispatch(setIsSaveViewOpen(false));
  };

  const viewHelp = () => (
    <ul>
      <li>{strings.savedContent.saveView.saveViewDescription1}</li>
      <li>{strings.savedContent.saveView.saveViewDescription2}</li>
    </ul>
  );

  return (
    <Dialog
      constraintsRef={constraintsRef}
      drag={true}
      resize={false}
      backdrop={false}
      fullScreenOnMobile={true}
      titleIcon={faSave}
      title={strings.savedContent.savedContent}
      type={"normal"}
      closeAction={handleCloseSaveViewDialog}
      isOpen={isSaveViewOpen}
      id="saved_content_dialog"
      minWidth={"600px"}
      hasHelp={true}
      helpId={"show_view_help"}
      helpContent={viewHelp()}
    >
      <SavedContent />
    </Dialog>
  );
};

export default SavedContentDialog;
