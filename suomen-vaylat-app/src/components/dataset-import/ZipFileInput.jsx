import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';

// Styled Components

const StyledImportedFileNameWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  margin-bottom: 12px;
  align-items: center;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
`;

const StyledImportedFileNameGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;

  .filename-group {
    display: flex;
    align-items: center;
    min-width: 0;
    @media ${(props) => props.theme.device.mobileL} {
      flex: 1;
    }
  }

  .filename {
    color: #2285d7;
    font-weight: 500;
    margin-right: 4px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    @media ${(props) => props.theme.device.mobileL} {
      font-size: 15px;
    }
  }

  .filesize {
    color: #2285d7;
    font-weight: 400;
    font-size: 0.96em;
    margin-right: 4px;
    white-space: nowrap;
    flex-shrink: 0;
  }
`;

const StyledFileLabel = styled.label`
  border: 0 !important; 
  clip: rect(1px, 1px, 1px, 1px); 
  height: 1px; 
  margin: -1px; 
  overflow: hidden; 
  padding: 0; 
  position: absolute; 
  width: 1px; 
  white-space: nowrap;
`;

const StyledDropBox = styled.div`
  padding: 24px 0;
  margin-bottom: 20px;
  background: #eaf3fa;
  border-radius: 16px;
  border: 2px dashed ${props => props.isDragActive ? '#2285d7' : '#6daae2'};
  text-align: center;
  position: relative;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: border-color 0.2s;
  ${({ isDragActive }) => isDragActive && `
    background: #e1f0fc;
  `}
`;

const StyledUploadIcon = styled(FontAwesomeIcon)`
  font-size: 32px;
  color: #4a90e2;
  margin-bottom: 6px;
`;

const StyledFileSelectText = styled.span`
  color: #2285d7;
  font-weight: 500;
  margin: 5px;
`;

const StyledFileLabelText = styled.span`
  font-weight: 600;
`;

const StyledErrorBox = styled.div`
  color: #d32f2f;
  font-size: 13px;
  margin-bottom: 10px;
  margin-top: -8px;
`;

// Utility function for middle ellipsis
const middleEllipsis = (filename = '', maxLength = 30) => {
  if (filename.length <= maxLength) return filename;
  const extMatch = filename.match(/\.[^/.]+$/);
  const ext = extMatch ? extMatch[0] : '';
  const name = filename.replace(ext, '');
  const charsToShow = maxLength - ext.length - 3;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    name.substring(0, frontChars) +
    '...' +
    name.substring(name.length - backChars) +
    ext
  );
};

export default function ZipFileInput({
  value,
  onFileChange,
  error,
  setError,
  disabled,
  children,
  id = 'import-dataset-zipfile',
  ...props
}) {
  const fileInput = useRef();
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = (file) => {
    if (!file) return '';
    if (
      file.type !== 'application/zip' &&
      !file.name.toLowerCase().endsWith('.zip')
    ) {
      return strings.datasetImport?.zipFileInput?.onlyZipAllowed || 'Vain zip-tiedostot ovat sallittuja.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return strings.datasetImport?.zipFileInput?.zipMaxSize || 'Zip-tiedoston maksimikoko on 10 Mt.';
    }
    return '';
  };

  const handleInput = (e) => {
    const file = e.target.files?.[0];
    handleNewFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleNewFile(file);
  };

  const handleNewFile = (file) => {
    const err = validateFile(file);
    setError(err);
    if (err) {
      onFileChange(null);
    } else {
      onFileChange(file);
    }
  };

  const dropBoxId = `${id}-dropbox`;

  const handleBoxKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.current.click();
    }
  };

  return (
    <>
      {children}
      <StyledFileLabel htmlFor="import-dataset-file-input" id={`${id}-input-label`}>
        {strings.datasetImport.fileSelect}
      </StyledFileLabel>
      <StyledDropBox
        id={dropBoxId}
        role="button"
        tabIndex={0}
        aria-label={strings.datasetImport.fileSelect}
        aria-disabled={disabled}
        aria-describedby={`${id}-input-label`}
        isDragActive={isDragActive}
        disabled={disabled}
        onClick={() => !disabled && fileInput.current.click()}
        onKeyDown={handleBoxKeyDown}
        onDrop={e => !disabled && handleDrop(e)}
        onDragOver={e => {
          if (!disabled) {
            e.preventDefault();
            setIsDragActive(true);
          }
        }}
        onDragLeave={() => !disabled && setIsDragActive(false)}
        {...props}
      >
        <input
          ref={fileInput}
          id="import-dataset-file-input"
          type="file"
          accept=".zip"
          hidden
          disabled={disabled}
          aria-disabled={disabled}
          aria-labelledby={`${id}-input-label`}
          onChange={disabled ? undefined : handleInput}
        />
        <StyledUploadIcon icon={faUpload} aria-hidden="true" />
        <StyledFileSelectText id={`${id}-file-select`}>
          {strings.datasetImport?.fileSelect}
        </StyledFileSelectText>
      </StyledDropBox>
      {value && (
        <StyledImportedFileNameWrapper
          id={`${id}-file-info`}
          role="status"
          aria-live="polite"
        >
          <StyledFileLabelText>
            {strings.datasetImport.file}&nbsp;
          </StyledFileLabelText>
          <StyledImportedFileNameGroup>
            <span className="filename-group">
              <span
                className="filename"
                title={value.name}
              >
                {middleEllipsis(value.name, 32)}
              </span>
              <span className="filesize">
                ({(value.size / 1024 / 1024).toFixed(2)} Mt)
              </span>
            </span>
            <IconButton
              size="small"
              aria-label={strings.datasetImport?.zipFileInput?.removeFile || "Remove selected file"}
              id={`${id}-remove-button`}
              sx={{ marginLeft: 1, color: '#c00' }}
              onClick={() => {
                onFileChange(null);
                setError('');
              }}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </IconButton>
          </StyledImportedFileNameGroup>
        </StyledImportedFileNameWrapper>
      )}
      {error && (
        <StyledErrorBox
          id={`${id}-error`}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </StyledErrorBox>
      )}
    </>
  );
}

ZipFileInput.propTypes = {
  value: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  id: PropTypes.string
};
