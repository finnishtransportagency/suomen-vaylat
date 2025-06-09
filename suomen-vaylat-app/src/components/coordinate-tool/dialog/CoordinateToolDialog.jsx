import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import strings from '../../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../state/hooks';
import { setIsCoordinateToolOpen } from '../../../state/slices/uiSlice';
import Dialog from '../../dialog/Dialog';
import { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import CoordinateTool from '../CoordinateTool';

const StyledLegendContainer = styled(motion.div)`
  position: absolute;
  top: 15px;
  right: 100%;
  border-radius: 4px;
  margin-right: 8px;
  height: 100%;
  min-width: 350px;
  max-width: 450px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.mainWhite};
  opacity: 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 13px;
    min-width: 80vw;
    max-width: calc(100vw - 70px);
  }
`;

const StyledHeaderContent = styled.div`
  height: 56px;
  z-index: 1;
  display: flex;
  border-radius: 4px 4px 0px 0px;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.mainColor1};
  padding: 16px;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
  p {
    margin: 0px;
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.mainWhite};
  }
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledTitleContent = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: 20px;
    margin-right: 8px;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
`;

const StyledGroupsContainer = styled.div`
  overflow-y: scroll;
  padding: 8px 4px 8px 8px;
`;

const listVariants = {
  visible: {
    y: 0,
    opacity: 1,
    pointerEvents: 'auto',
    filter: 'blur(0px)'
  },
  hidden: {
    y: '100%',
    opacity: 0,
    pointerEvents: 'none',
    filter: 'blur(10px)'
  }
};

const CoordinateToolDialog = ({ constraintsRef }) => {
  const { isCoordinateToolOpen } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);

  return (
    <Dialog
      constraintsRef={
        constraintsRef
      } /* Reference div for dialog drag boundaries */
      drag={true} /* Enable (true) or disable (false) drag */
      resize={false}
      backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
      fullScreenOnMobile={
        false
      } /* Scale dialog full width / height when using mobile device */
      titleIcon={null} /* Use icon on title or null */
      title={strings.coordinateTool.title} /* Dialog header title */
      type={'normal'} /* Dialog type */
      closeAction={() =>
        store.dispatch(setIsCoordinateToolOpen(false))
      } /* Action when pressing dialog close button or backdrop */
      isOpen={isCoordinateToolOpen} /* Dialog state */
      id="coordinate_tool_dialog"
      width={'400px'}
      overflow={'auto'}
      bottom={"10px"}
      right={"80px"}
    >
      <CoordinateTool/>
    </Dialog>
  );
};
export default CoordinateToolDialog;
