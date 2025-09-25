import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect
} from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faTrash,
  faPen,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';
import { ReactReduxContext } from 'react-redux';
import strings from '../../../../../translations';
import { activateView } from '../../../../../utils/rpcUtil';
import {
  setIsSaveViewOpen,
  setWarning
} from '../../../../../state/slices/uiSlice';
import { setEditingView, setViews } from '../../../../../state/slices/rpcSlice';
import Moment from 'react-moment';

/* animation variants */
const masterHeaderIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 }
};

const listVariants = {
  visible: { height: 'auto', opacity: 1 },
  hidden: { height: 0, opacity: 0 }
};

const StyledGroupHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  &:focus {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1Selected};
    outline-offset: 2px;
  }
`;

const StyledLefContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSelectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${(p) => p.theme.colors.mainColor1};
    font-size: 18px;
  }
`;

const StyledGroupName = styled.p`
  max-width: 220px;
  user-select: none;
  margin: 0;
  padding-left: 0;
  font-size: 14px;
  font-weight: bold;
  color: ${(p) => p.theme.colors.mainColor1};
`;

const StyledGroup = styled(motion.div)`
  margin: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 0 8px 25px;
  display: flex;
  flex-direction: column;
`;

const StyledItem = styled.div`
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 16px;
  background: transparent;
`;

const StyledItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  width: 100%;
`;

const StyledItemLeft = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 0px;
  align-items: center;
  gap: 8px;
`;

const StyledItemTitle = styled.a`
  margin: 0;
  font-weight: 500;
  color: ${(p) => p.theme.colors.mainColor1} !important;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: underline;

  &:hover {
    color: ${(p) => p.theme.colors.mainColor2} !important;
  }
`;

const StyledItemsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

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

const StyledModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 30, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6000;
`;

const StyledModal = styled.div`
  width: 520px;
  max-width: calc(100% - 32px);
  background: ${(p) => p.theme.colors.mainWhite};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  color: ${(p) => p.theme.colors.black};
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StyledModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${(p) => p.theme.colors.mainColor1};

  /* ellipsis when title is too long */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* ensure it can shrink inside flex containers */
  display: block;
  max-width: 100%;
`;

const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.mainColor1};
  font-size: 18px;
  cursor: pointer;
`;

const StyledModalBody = styled.div`
  max-height: 60vh;
  overflow: auto;
  font-size: 13px;
  line-height: 1.4;
`;

const StyledMetaRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  flex-wrap: wrap;
  color: ${(p) => p.theme.colors.black};

  & > b {
    min-width: 90px;
  }

  & > span,
  & > pre {
    word-break: break-word;
  }
`;

const ViewsGroup = () => {
  const [open, setOpen] = useState(false);
  const { store } = useContext(ReactReduxContext);
  const channel = useSelector((s) => s.rpc.channel);
  const views = useSelector((s) => s.rpc.views) || [];

  const prefix = 'layerlist-views-group-';
  const headerId = `${prefix}header`;
  const listId = `${prefix}list`;

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoView, setInfoView] = useState(null);
  const lastActiveElRef = useRef(null);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  const onActivate = useCallback(
    (view) => {
      activateView(store, channel, view);
    },
    [store, channel]
  );

  const onEdit = useCallback(
    (view) => {
      store.dispatch(setEditingView(view));
      store.dispatch(setIsSaveViewOpen(true));
    },
    [store]
  );

  const onDelete = useCallback(
    (view) => {
      const updated = (views || []).filter((v) => v.id !== view.id);
      try {
        window.localStorage.setItem('views', JSON.stringify(updated));
      } catch (err) {
        // ignore storage errors
      }
      store.dispatch(setViews(updated));
    },
    [store, views]
  );

  const handleDefault = (view) => {
    const existingViews = Array.isArray(views) ? views : [];
    const updatedViews = existingViews.map((v) =>
      v.id === view.id
        ? { ...v, default: !v.default }
        : { ...v, default: false }
    );

    try {
      window.localStorage.setItem('views', JSON.stringify(updatedViews));
    } catch (err) {
      console.warn('Could not persist views to localStorage', err);
    }
    store.dispatch(setViews(updatedViews));
  };

  // Open info modal for the view
  const openInfo = (ev, view) => {
    ev && ev.stopPropagation();
    lastActiveElRef.current = document.activeElement;
    setInfoView(view);
    setInfoOpen(true);
  };

  const closeInfo = () => {
    setInfoOpen(false);
    setInfoView(null);
    try {
      lastActiveElRef.current && lastActiveElRef.current.focus();
    } catch (e) {
      // ignore focus restore errors
    }
  };

  // close on esc
  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeInfo();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [infoOpen]);

  // focus the close button after modal mounts for accessibility
  useEffect(() => {
    if (infoOpen) {
      const t = setTimeout(() => {
        try {
          closeBtnRef.current && closeBtnRef.current.focus();
        } catch (e) {}
      }, 40);
      return () => clearTimeout(t);
    }
  }, [infoOpen]);

  // simple focus trap: keep Tab/Shift+Tab within modal
  const handleModalKeyDown = useCallback((e) => {
    if (e.key !== 'Tab') return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      // backward
      if (active === first || active === modal) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // forward
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="saved views group"
      aria-labelledby={headerId}
    >
      <StyledGroupHeader
        id={headerId}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((s) => !s)}
        type="button"
      >
        <StyledLefContent>
          <StyledSelectButton aria-hidden="true">
            <motion.div
              initial="closed"
              animate={open ? 'open' : 'closed'}
              variants={masterHeaderIconVariants}
              transition={{ duration: 0.22, type: 'tween' }}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </motion.div>
          </StyledSelectButton>

          <div>
            <StyledGroupName id={`${prefix}label`}>
              {strings.layerlist?.userContent?.views?.title}
            </StyledGroupName>
          </div>
        </StyledLefContent>
      </StyledGroupHeader>

      <StyledGroup
        id={listId}
        parentId={-1}
        role="list"
        aria-labelledby={headerId}
        initial="hidden"
        animate={open ? 'visible' : 'hidden'}
        variants={listVariants}
        transition={{ duration: 0.22, type: 'tween' }}
      >
        {views?.length > 0 ? (
          [...views]
            .slice() // optional defensive copy
            .sort((a, b) => new Date(b.saveDate) - new Date(a.saveDate))
            .map((view) => {
              const isDefaultView = !!view.default;
              const itemId = `${prefix}item-${view.id}`;
              const nameId = `${itemId}-name`;
              const editId = `${itemId}-edit`;
              const deleteId = `${itemId}-delete`;
              const infoId = `${itemId}-info`;
              const defaultBtnId = `${itemId}-default`;

              return (
                <StyledItem
                  key={view.id}
                  id={itemId}
                  role="listitem"
                  aria-labelledby={nameId}
                >
                  <StyledItemsWrapper>
                    <StyledItemLeft>
                      {isDefaultView ? (
                        <StyledIconButton
                          id={defaultBtnId}
                          aria-hidden
                          title={strings.savedContent?.saveView?.defaultView}
                          onClick={() => handleDefault(view)}
                        >
                          <FontAwesomeIcon
                            style={{ width: '1em' }}
                            icon={faStarSolid}
                          />
                        </StyledIconButton>
                      ) : (
                        <StyledIconButton
                          id={defaultBtnId}
                          aria-hidden
                          title={strings.savedContent?.saveView?.setDefaultView}
                          onClick={() => handleDefault(view)}
                        >
                          <FontAwesomeIcon
                            style={{ width: '1em' }}
                            icon={faStarRegular}
                          />
                        </StyledIconButton>
                      )}

                      <StyledItemTitle
                        id={nameId}
                        role="button"
                        tabIndex={0}
                        onClick={() => onActivate(view)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onActivate(view);
                          }
                        }}
                        aria-label={`${
                          strings.savedContent?.saveView?.viewName || 'View'
                        }: ${view.name}`}
                      >
                        {view.name}
                      </StyledItemTitle>
                    </StyledItemLeft>

                    <StyledItemsRight>
                      <StyledIconButton
                        id={deleteId}
                        aria-label={
                          strings.savedContent?.saveView?.deleteSavedView ||
                          'Delete view'
                        }
                        onClick={(ev) => {
                          ev.stopPropagation();
                          store.dispatch(
                            setWarning({
                              title:
                                strings.savedContent.saveView.confirmDelete,
                              subtitle: null,
                              cancel: {
                                text: strings.general.cancel,
                                action: () => store.dispatch(setWarning(null))
                              },
                              confirm: {
                                text: strings.general.continue,
                                action: () => {
                                  onDelete(view);
                                  store.dispatch(setWarning(null));
                                }
                              }
                            })
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </StyledIconButton>

                      <StyledIconButton
                        id={editId}
                        aria-label={
                          strings.savedContent?.saveView?.editView ||
                          'Edit view'
                        }
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onEdit(view);
                        }}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </StyledIconButton>

                      <StyledIconButton
                        id={infoId}
                        aria-label={
                          strings.savedContent?.saveView?.viewInfo ||
                          'View info'
                        }
                        onClick={(ev) => openInfo(ev, view)}
                        style={{ fontSize: '18px' }}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </StyledIconButton>
                    </StyledItemsRight>
                  </StyledItemsWrapper>
                </StyledItem>
              );
            })
        ) : (
          <div role="status" aria-live="polite">
            {strings.savedContent?.saveView?.noSavedViews || 'No saved views'}
          </div>
        )}
      </StyledGroup>

      {infoOpen && infoView && (
        <StyledModalOverlay
          role="dialog"
          aria-modal="true"
          id={`${prefix}info-modal`}
          aria-labelledby={`${prefix}info-modal-title`}
          aria-describedby={
            infoView.description ? `${prefix}info-modal-desc` : undefined
          }
          aria-label={
            strings.savedContent?.saveView?.viewInfo || 'View information'
          }
        >
          <StyledModal
            role="document"
            aria-describedby={`${prefix}info-modal-body`}
            ref={modalRef}
            onKeyDown={handleModalKeyDown}
          >
            <StyledModalHeader>
              <StyledModalTitle id={`${prefix}info-modal-title`}>
                {infoView.name}
              </StyledModalTitle>
              <StyledCloseButton
                aria-label="Close"
                onClick={closeInfo}
                id={`${prefix}info-modal-close`}
                ref={closeBtnRef}
              >
                <FontAwesomeIcon icon={faTimes} />
              </StyledCloseButton>
            </StyledModalHeader>

            <StyledModalBody id={`${prefix}info-modal-body`}>
              <StyledMetaRow id={`${prefix}info-modal-name`}>
                <b>{strings.general?.name || 'Name'}:</b>
                <span>{infoView.name || '-'}</span>
              </StyledMetaRow>

              {infoView.description && (
                <StyledMetaRow id={`${prefix}info-modal-desc`}>
                  <b>{strings.general?.description || 'Description'}:</b>
                  <span>{infoView.description}</span>
                </StyledMetaRow>
              )}

              <StyledMetaRow id={`${prefix}info-modal-saved`}>
                <b>{strings.savedContent?.saveView?.savedAt || 'Saved'}:</b>
                <span>
                  <Moment format="DD.MM.YYYY HH:mm" tz="Europe/Helsinki">
                    {infoView.saveDate}
                  </Moment>
                </span>
              </StyledMetaRow>

              <StyledMetaRow id={`${prefix}info-modal-default`}>
                <b>{strings.savedContent?.saveView?.default || 'Default'}:</b>
                <span>
                  {infoView.default
                    ? strings.general?.yes || 'Yes'
                    : strings.general?.no || 'No'}
                </span>
              </StyledMetaRow>

              {infoView.data && (
                <>
                  <StyledMetaRow id={`${prefix}info-modal-zoom`}>
                    <b>{strings.savedContent?.saveView?.zoom || 'Zoom'}:</b>
                    <span>{infoView.data.zoom ?? '-'}</span>
                  </StyledMetaRow>

                  <StyledMetaRow id={`${prefix}info-modal-center`}>
                    <b>{strings.savedContent?.saveView?.center || 'Center'}:</b>
                    <span>
                      X: {infoView.data.x ?? '-'}, Y: {infoView.data.y ?? '-'}
                    </span>
                  </StyledMetaRow>

                  <StyledMetaRow id={`${prefix}info-modal-layers`}>
                    <b>{strings.savedContent?.saveView?.layers || 'Layers'}:</b>
                    <span>
                      {infoView.data.layers ? infoView.data.layers.length : 0}
                    </span>
                  </StyledMetaRow>

                  <StyledMetaRow id={`${prefix}info-modal-language`}>
                    <b>
                      {strings.savedContent?.saveView?.language || 'Language'}:
                    </b>
                    <span>{infoView.data.language || '-'}</span>
                  </StyledMetaRow>
                </>
              )}
            </StyledModalBody>
          </StyledModal>
        </StyledModalOverlay>
      )}
    </div>
  );
};

export default ViewsGroup;
