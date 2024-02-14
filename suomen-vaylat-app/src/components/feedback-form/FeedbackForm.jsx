import React, { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import FormLayerSearch from './FormLayerSearch';
import { useAppSelector } from '../../state/hooks';
import store from '../../state/store';
import { setIsFeedBackFormOpen } from '../../state/slices/uiSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px;
  width: 350px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const ContactInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;

const ContactInput = styled.input`
  margin-bottom: 10px;
`;

const StyledMessage  = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  height: 10px
`;


const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  align-items: center;
  gap: 30px;
`;

const StyledButton = styled.div`
  width: 78px;
  height: 32px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: ${props => props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 13px;
  color: #fff;
`;

const FeedbackForm = ({  groups, layers }) => {
  useAppSelector((state) => state.language);
  const [selectedService, setSelectedService] = useState('');
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [specificTopic, setSpecificTopic] = useState('');
  const [selectedAineisto, setSelectedAineisto] = useState([]);
  const [description, setDescription] = useState('');
  const [locationInfo, setLocationInfo] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleSpecificTopicChange = (event) => {
    setSpecificTopic(event.target.value);
  };

  const handleAineistoChange = (selectedLayers) => {
    setSelectedAineisto(selectedLayers.map(layer => layer.value));
};

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleLocationInfoChange = (event) => {
    setLocationInfo(event.target.value);
  };

  const handleScreenshotsChange = (event) => {
    const fileList = event.target.files;
    setScreenshots([...screenshots, ...fileList]);
  };

  const handleNameChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
  };

  const handleEmailChange = (event) => {
    const enteredEmail = event.target.value;
    setEmail(enteredEmail);
  };
  
  const handleEmailValidation = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || emailPattern.test(email)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Syötä kelvollinen sähköpostiosoite');
    }
  };
  


  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (topic && description && name && email) {
      setSuccessMessage(strings.appInfo.feedbackForm.successMessage);
      store.dispatch(setIsFeedBackFormOpen(false))
    } else {
      setErrorMessage(strings.appInfo.feedbackForm.errorMessage);
    }
  };
  
  const handleClose = () => {
    store.dispatch(setIsFeedBackFormOpen(false))
  }


  return (
    <FormContainer>
      <FormGroup>
        <Label htmlFor="topicSelect">{strings.appInfo.feedbackForm.topicSelect}</Label>
        <select
          id="topicSelect"
          value={topic}
          onChange={handleTopicChange}
          required
        >
          <option value="selectTopic">{strings.appInfo.feedbackForm.selectTopic}</option>
          <option value="toiminnot">{strings.appInfo.feedbackForm.toiminnot}</option>
          <option value="aineistot">{strings.appInfo.feedbackForm.aineistot}</option>
        </select>
      </FormGroup>


      {topic === 'aineistot' && (
      <FormGroup>
        <select
          id="categorySelect"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="selectCategory">{strings.appInfo.feedbackForm.selectCategory}</option>
          <option value="tiestotiedot">{strings.appInfo.feedbackForm.tiestotiedot}</option>
          <option value="hanketiedot">{strings.appInfo.feedbackForm.hanketiedot}</option>
          <option value="digiroad">{strings.appInfo.feedbackForm.digiroad}</option>
          <option value="taitorakennerekisteri">{strings.appInfo.feedbackForm.taitorakennerekisteri}</option>
          <option value="ratatiedot">{strings.appInfo.feedbackForm.ratatiedot}</option>
          <option value="vesivaylatiedot">{strings.appInfo.feedbackForm.vesivaylatiedot}</option>
          <option value="muutaineistot">{strings.appInfo.feedbackForm.muutaineistot}</option>
        </select>
      </FormGroup>
    )}

    {topic === 'aineistot' && (
      <FormGroup>
        <Label htmlFor="aineistoSelect">{strings.appInfo.feedbackForm.aineistoSelect}</Label>
        <FormLayerSearch
          layers={layers}
          groups={groups}
          onLayerSelect={handleAineistoChange}
        />
      </FormGroup>
    )}

    {topic !== 'aineistot' && (
  <FormGroup>
    <Label htmlFor="specificTopicInput">{strings.appInfo.feedbackForm.specificTopicInput}</Label>
    <select
      id="specificTopicInput"
      value={specificTopic}
      onChange={handleSpecificTopicChange}
    >
      <option value="selectSpecificTopic">{strings.appInfo.feedbackForm.selectSpecificTopic}</option>
      <option value="kaytontuki">{strings.appInfo.feedbackForm.kaytontuki}</option>
      <option value="virhetilanteet">{strings.appInfo.feedbackForm.virhetilanteet}</option>
      <option value="kehitysehdotus">{strings.appInfo.feedbackForm.kehitysehdotus}</option>
      <option value="palaute">{strings.appInfo.feedbackForm.palaute}</option>
      <option value="laatupuute">{strings.appInfo.feedbackForm.laatupuute}</option>
    </select>
  </FormGroup>
)}


      <FormGroup>
        <Label htmlFor="descriptionTextarea">{strings.appInfo.feedbackForm.descriptionTextarea}</Label>
        <textarea
          id="descriptionTextarea"
          value={description}
          onChange={handleDescriptionChange}
          placeholder={strings.appInfo.feedbackForm.descriptionPlaceholder}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="locationInfoInput">{strings.appInfo.feedbackForm.locationInfoInput}</Label>
        <input
          type="text"
          id="locationInfoInput"
          value={locationInfo}
          onChange={handleLocationInfoChange}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="screenshotsInput">{strings.appInfo.feedbackForm.screenshotsInput}</Label>
        <input
          type="file"
          id="screenshotsInput"
          onChange={handleScreenshotsChange}
          multiple
        />
      </FormGroup>

      <ContactInfoContainer>
        <Label>{strings.appInfo.feedbackForm.contactInfo}</Label>
        <ContactInput
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder={strings.appInfo.feedbackForm.contactName}
          required
        />
        <ContactInput
          type="email"
          placeholder={strings.appInfo.feedbackForm.contactEmail}
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailValidation}
          required
        />
      </ContactInfoContainer>

      <StyledMessage>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </StyledMessage>

      <StyledButtonContainer>
        <StyledButton onClick={handleSubmit}>
          {strings.general.submit}
        </StyledButton>
        <StyledButton onClick={handleClose}>
            {strings.general.close}
        </StyledButton>
        </StyledButtonContainer>
    </FormContainer>
  );
};

export default FeedbackForm;