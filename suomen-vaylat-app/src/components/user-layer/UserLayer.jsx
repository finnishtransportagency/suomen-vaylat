import { useContext, useEffect } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import Badge from 'react-bootstrap/Badge';
import { theme } from '../../theme/theme';
import strings from '../../translations';

import styled from 'styled-components';
import {
  setEditingUserlayer,
  setMapLayerVisibility
} from '../../state/slices/rpcSlice';
import { updateLayers } from '../../utils/rpcUtil';
import LayerlistSwitch from '../layerlists/hierarchical-layerlist/LayerlistSwitch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { setIsDatasetImportOpen, setWarning } from '../../state/slices/uiSlice';
import { Slide, toast } from 'react-toastify';
import { IS_EXTRANET } from '../../utils/appInfoUtil';

const StyledLayerContainer = styled.div`
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  width: 100%;
`;

const StyledLayerName = styled.p`
  word-break: break-word;
  user-select: none;
  color: ${(props) =>
    props.themeStyle
      ? props.theme.colors.secondaryColorGreen
      : props.theme.colors.mainColor1};
  margin: 0px;
  font-size: 14px;
  padding-left: 8px;
`;

/* Icon button reused from geometries for consistent look */
const StyledIconButton = styled.button`
  color: ${(p) => p.theme.colors.mainColor1};
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.mainColor2};
  }
`;

const StyledItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const StyledItemsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const UserLayer = ({ layer }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);

  // Build unique IDs for accessibility, using the required prefix "user-layer-"
  const containerId = `user-layer-${layer.id}`;
  const nameId = `${containerId}-name`;
  const deleteBtnId = `${containerId}-delete`;
  const editBtnId = `${containerId}-edit`;
  const switchId = `${containerId}-switch`;
  const badgeId = `${containerId}-badge`;

  const handleLayerVisibility = (channel, layer) => {
    store.dispatch(setMapLayerVisibility(layer));
    updateLayers(store, channel);
  };

  const handleEditClick = (ev) => {
    ev && ev.stopPropagation();
    store.dispatch(setEditingUserlayer(layer));
    store.dispatch(setIsDatasetImportOpen(true));
  };

  const handleDeleteClick = (ev) => {
    ev && ev.stopPropagation();
    store.dispatch(
      setWarning({
        title: strings.savedContent?.userLayer?.confirmDelete,
        subtitle: null,
        cancel: {
          text: strings.general.cancel,
          action: () => store.dispatch(setWarning(null))
        },
        confirm: {
          text: strings.general.continue,
          action: () => {
            channel.deleteUserLayer(
              [layer.id],
              () => {
                updateLayers(store, channel);
                toast.success(strings.savedContent?.userLayer?.deleteSuccess, {
                  position: 'top-center',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                  theme: 'colored',
                  transition: Slide
                });
              },
              () => {
                toast.error(strings.savedContent?.userLayer?.deleteFail, {
                  position: 'top-center',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                  theme: 'colored',
                  transition: Slide
                });
              }
            );
            store.dispatch(setWarning(null));
          }
        }
      })
    );
  };

  return (
    <StyledLayerContainer
      id={containerId}
      aria-labelledby={nameId}
      className={`list-layer ${layer.visible && 'list-layer-active'}`}
      key={'layer' + layer.id}
      role="listitem"
      aria-label={`user-layer-${layer.id}`}
    >
      <StyledItemLeft>
        <StyledLayerName id={nameId}>
          {layer.name}{' '}
          {layer.newLayer && (
            <Badge
              id={badgeId}
              style={{
                color: theme.colors.mainWhite,
                backgroundColor: theme.colors.mainColor1,
                marginLeft: '.5em'
              }}
              pill
              bg="null"
            >
              {strings.tooltips.layerlist.newLayer}
            </Badge>
          )}
        </StyledLayerName>
      </StyledItemLeft>

      <StyledItemsRight>
        {IS_EXTRANET && (
          <>
            <StyledIconButton
              id={deleteBtnId}
              type="button"
              aria-label={strings.savedContent?.userLayer?.deleteLayer || `Delete ${layer.name}`}
              title={strings.savedContent?.userLayer?.deleteLayer}
              onClick={handleDeleteClick}
            >
              <FontAwesomeIcon icon={faTrash} />
            </StyledIconButton>

            <StyledIconButton
              id={editBtnId}
              type="button"
              aria-label={strings.savedContent?.userLayer?.editLayer || `Edit ${layer.name}`}
              title={strings.savedContent?.userLayer?.editLayer}
              onClick={handleEditClick}
            >
              <FontAwesomeIcon icon={faPen} />
            </StyledIconButton>
          </>
        )}

        <LayerlistSwitch
          id={switchId}
          action={() => handleLayerVisibility(channel, layer)}
          isSelected={layer.visible}
          layer={layer}
          aria-label={`Toggle visibility for ${layer.name}`}
          aria-labelledby={nameId}
          aria-checked={!!layer.visible}
        />
      </StyledItemsRight>
    </StyledLayerContainer>
  );
};

export default UserLayer;