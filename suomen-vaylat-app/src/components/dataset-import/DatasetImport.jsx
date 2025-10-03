import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Slide, toast } from 'react-toastify';

import { CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import { setIsDatasetImportOpen } from '../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import StyleEditor from './style-editor/StyleEditor';
import GeneralInformation from './general-information/GeneralInformation';
import { setEditingUserlayer } from '../../state/slices/rpcSlice';
import { updateLayers } from '../../utils/rpcUtil';

const StyledMainContainer = styled.div`
  background: #f6f7fa;
  border-radius: 16px;
  position: relative;
  background-color: white;
`;
const OverlaySpinner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.65);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
`;
const StyledTabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-height: 100px;
  background-color: #f2f2f2;
`;
const StyledTab = styled.div`
  z-index: 2;
  padding: 8px;
  user-select: none;
  width: 50%;
  cursor: pointer;
  color: ${(props) =>
    props['aria-selected']
      ? props.theme.colors.mainColor1 || '#0067b1'
      : '#656565'};
  text-align: center;
  transition: color 0.2s ease-out;
  display: flex;
  justify-content: center;
  background: ${(props) => (props['aria-selected'] ? '#fff' : '#F2F2F2')};
  border-radius: 4px 4px 0 0;
  font-weight: ${(props) => (props['aria-selected'] ? 'bold' : 'normal')};
  p {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    padding: 10px;
  }
`;
const StyledSwiper = styled(Swiper)`
  .swiper-slide {
    background-color: #fff;
    padding: 32px 32px 24px 32px;
    height: auto;
  }
  transition: box-shadow 0.3s ease-out;
`;
const StyledSubmitButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
  margin-bottom: 8px;
  gap: 18px;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
  margin: 0px 32px 24px 32px;
`;
const StyledPrimaryButton = styled.button`
  min-width: 180px;
  height: 40px;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.mainWhite};
  border-radius: 20px;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.2s;
  border: none;
  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.buttonActive};
  }
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  svg {
    margin-right: 7px;
    font-size: 18px;
  }
`;
const StyledSecondaryButton = styled(StyledPrimaryButton)`
  background-color: ${({ theme }) => theme.colors.mainWhite};
  color: ${({ theme }) => theme.colors.mainColor1};
  border: 2px solid ${({ theme }) => theme.colors.mainColor1};
  font-weight: 600;
  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.buttonActive};
  }
  svg {
    color: ${({ theme }) => theme.colors.mainColor1};
  }
`;

const allowedCharsExp = /^[A-Za-z0-9_\- ()]*$/;
const initialLangObj = { name: '', desc: '', source: '' };
const initialFields = {
  fi: { ...initialLangObj },
  sv: { ...initialLangObj },
  en: { ...initialLangObj }
};
const initialErrors = {
  fi: { name: false, desc: false, source: false },
  sv: { name: false, desc: false, source: false },
  en: { name: false, desc: false, source: false }
};

const DatasetImport = () => {
  const { store } = useContext(ReactReduxContext);

  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { channel, editingUserlayer } = useAppSelector((state) => state.rpc);

  const [fields, setFields] = useState(
    editingUserlayer?.locale || initialFields
  );
  const [errors, setErrors] = useState(initialErrors);

  // accordionOpen controls which language sections are included
  const [accordionOpen, setAccordionOpen] = useState({
    fi: true, // Finnish shown by default
    sv: false,
    en: false
  });

  const [styleEditorKey, setStyleEditorKey] = useState(0);
  const [style, setStyle] = useState(editingUserlayer?.style || {});

  const swiperRef = useRef();

  const handleInput = (language, field, value) => {
    setFields((old) => ({
      ...old,
      [language]: { ...old[language], [field]: value }
    }));
    setErrors((old) => ({
      ...old,
      [language]: {
        ...old[language],
        [field]: !!value && !allowedCharsExp.test(value)
      }
    }));
  };

  const resetForm = () => {
    setUploadedFile(null);
    setFileError('');
    setFields(initialFields);
    setErrors(initialErrors);
    setAccordionOpen({ fi: true, sv: false, en: false });
    setSelectedTab(0);
    setStyle({});
    setStyleEditorKey((k) => k + 1);
  };

  const handleSubmitDataset = () => {
    if (!disableImport && !isSubmitting) {
      setIsSubmitting(true);
      setTimeout(() => {
        const locale = {
          fi: fields.fi || {},
          sv: accordionOpen.sv ? fields.sv || {} : {},
          en: accordionOpen.en ? fields.en || {} : {}
        };

        const fileToBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

        fileToBase64(uploadedFile).then((base64str) => {
          const dataset = {
            fileName: uploadedFile.name,
            fileType: uploadedFile.type,
            fileDataUrl: base64str,
            locale,
            style
          };

          channel.importUserLayer(
            [dataset],
            () => {
              setIsSubmitting(false);
              resetForm();
              toast.success(strings.datasetImport.submitSuccess, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide
              });
              channel.fetchUserLayers(
                () => {
                  updateLayers(store, channel);
                },
                () => {
                  toast.error(strings.datasetImport.fetchUserLayersError, {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                    transition: Slide
                  });
                }
              );
            },
            (data) => {
              setIsSubmitting(false);
              setUploadedFile(null);
              toast.error(strings.datasetImport.submitFail, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide
              });
              console.error(strings.datasetImport.submitFail + ':' + data);
            }
          );
        });
      }, 1200);
    }
  };

  const handleSaveDataset = () => {
    if (!disableUpdate && !isSubmitting) {
      setIsSubmitting(true);
      setTimeout(() => {
        const locale = {
          fi: fields.fi || {},
          sv: accordionOpen.sv ? fields.sv || {} : {},
          en: accordionOpen.en ? fields.en || {} : {}
        };

        channel.updateUserLayer(
          [editingUserlayer.id, { locale, style }],
          () => {
            store.dispatch(setIsDatasetImportOpen(false));
            setIsSubmitting(false);
            resetForm();
            updateLayers(store, channel);
            store.dispatch(setEditingUserlayer(null));
            toast.success(strings.datasetImport.saveSuccess, {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
              transition: Slide
            });
          },
          (data) => {
            setIsSubmitting(false);
            setUploadedFile(null);
            toast.error(strings.datasetImport.saveFail, {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
              transition: Slide
            });
            console.error(strings.datasetImport.submitFail + ':' + data);
          }
        );
      }, 1200);
    }
  };

  const requiredFi = !!fields.fi.name && !errors.fi.name;
  const allFieldsValid = Object.values(errors).every((langObj) =>
    Object.values(langObj).every((val) => !val)
  );
  const disableImport = !(
    uploadedFile &&
    !fileError &&
    requiredFi &&
    allFieldsValid
  );
  const disableUpdate = !(!fileError && requiredFi && allFieldsValid);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(selectedTab);
    }
  }, [selectedTab]);

  // Close all accordions when switching away from General tab (tab index != 0)
  useEffect(() => {
    if (selectedTab !== 0) {
      setAccordionOpen({ fi: false, sv: false, en: false });
    } else {
      // when returning to General tab, ensure Finnish open and leave others collapsed
      setAccordionOpen((old) => ({ fi: true, sv: !!old.sv, en: !!old.en }));
    }
  }, [selectedTab]);

  return (
    <StyledMainContainer>
      {isSubmitting && (
        <OverlaySpinner
          id="import-dataset-spinner"
          role="status"
          aria-live="polite"
          aria-label="Uploading"
        >
          <CircularProgress size={62} thickness={4} />
        </OverlaySpinner>
      )}

      <StyledTabs
        role="tablist"
        aria-label={strings.datasetImport.title}
        id="import-dataset-tablist"
      >
        <StyledTab
          id="import-dataset-tab-general"
          type="button"
          role="tab"
          aria-selected={selectedTab === 0}
          aria-controls="import-dataset-panel-general"
          tabIndex={selectedTab === 0 ? 0 : -1}
          onClick={() => setSelectedTab(0)}
        >
          <p>{strings.datasetImport.tabGeneral}</p>
        </StyledTab>
        <StyledTab
          id="import-dataset-tab-visualization"
          type="button"
          role="tab"
          aria-selected={selectedTab === 1}
          aria-controls="import-dataset-panel-visualization"
          tabIndex={selectedTab === 1 ? 0 : -1}
          onClick={() => setSelectedTab(1)}
        >
          <p>{strings.datasetImport.tabVisualization}</p>
        </StyledTab>
      </StyledTabs>

      <StyledSwiper
        ref={swiperRef}
        allowTouchMove={false}
        speed={250}
        onSlideChange={(swiper) => setSelectedTab(swiper.activeIndex)}
      >
        <SwiperSlide
          id="import-dataset-panel-general"
          role="tabpanel"
          aria-labelledby="import-dataset-tab-general"
        >
          <GeneralInformation
            fields={fields}
            errors={errors}
            accordionOpen={accordionOpen}
            setAccordionOpen={setAccordionOpen}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            fileError={fileError}
            setFileError={setFileError}
            handleInput={handleInput}
            isSubmitting={isSubmitting}
            isEditing={editingUserlayer !== null}
          />
        </SwiperSlide>

        <SwiperSlide
          id="import-dataset-panel-visualization"
          role="tabpanel"
          aria-labelledby="import-dataset-tab-visualization"
        >
          <StyleEditor
            key={styleEditorKey}
            initialStyle={style}
            onChange={setStyle}
          />
        </SwiperSlide>
      </StyledSwiper>

      <StyledSubmitButtonGroup
        id="import-dataset-submit-button-group-bottom"
        aria-label="Import dataset actions"
      >
        <StyledSecondaryButton
          type="button"
          tabIndex={0}
          id="import-dataset-cancel-button-bottom"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          onClick={() => {
            // close import dialog and reset form
            store.dispatch(setIsDatasetImportOpen(false));
            resetForm();
          }}
        >
          {strings.datasetImport.cancel}
        </StyledSecondaryButton>

        {editingUserlayer ? (
          <StyledPrimaryButton
            type="button"
            tabIndex={0}
            id="import-dataset-savebutton-bottom"
            disabled={disableUpdate || isSubmitting}
            aria-disabled={disableUpdate || isSubmitting}
            onClick={handleSaveDataset}
          >
            {strings.general.save}
          </StyledPrimaryButton>
        ) : (
          <StyledPrimaryButton
            type="button"
            tabIndex={0}
            id="import-dataset-import-button-bottom"
            disabled={disableImport || isSubmitting}
            aria-disabled={disableImport || isSubmitting}
            onClick={handleSubmitDataset}
          >
            <FontAwesomeIcon icon={faUpload} />
            {strings.datasetImport.import}
          </StyledPrimaryButton>
        )}
      </StyledSubmitButtonGroup>
    </StyledMainContainer>
  );
};

export default DatasetImport;
