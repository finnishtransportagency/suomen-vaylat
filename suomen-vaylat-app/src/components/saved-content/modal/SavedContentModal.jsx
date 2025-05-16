import { useContext } from "react";
import Modal from '../../modal/Modal';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from "../../../state/hooks";
import strings from "../../../translations";
import SavedContent from "../SavedContent";
import { setIsSaveViewOpen } from "../../../state/slices/uiSlice";
import { ReactReduxContext } from "react-redux";

const SavedContentModal = ({ constraintsRef }) => {
  const { isSaveViewOpen } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  const handleCloseSaveViewModal = () => {
    store.dispatch(setIsSaveViewOpen(false));
  };

  const viewHelp = () => (
    <ul>
      <li>{strings.savedContent.saveView.saveViewDescription1}</li>
      <li>{strings.savedContent.saveView.saveViewDescription2}</li>
    </ul>
  );

  return (
    <Modal
      constraintsRef={constraintsRef}
      drag={true}
      resize={false}
      backdrop={false}
      fullScreenOnMobile={true}
      titleIcon={faSave}
      title={strings.savedContent.savedContent}
      type={"normal"}
      closeAction={handleCloseSaveViewModal}
      isOpen={isSaveViewOpen}
      id="saved_content_modal"
      minWidth={"600px"}
      hasHelp={true}
      helpId={"show_view_help"}
      helpContent={viewHelp()}
    >
      <SavedContent />
    </Modal>
  );
};

export default SavedContentModal;
