import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';

const StyledImportedFileNameWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
`;

const StyledImportedFileNameGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap; // Never allow wrap

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

const middleEllipsis = (filename = '', maxLength = 30) => {
  // If filename is short, return as is
  if (filename.length <= maxLength) return filename;
  const extMatch = filename.match(/\.[^/.]+$/);
  const ext = extMatch ? extMatch[0] : '';
  const name = filename.replace(ext, '');
  const charsToShow = maxLength - ext.length - 3; // 3 for "..."
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    name.substring(0, frontChars) +
    '...' +
    name.substring(name.length - backChars) +
    ext
  );
}

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

  const uploadBoxStyle = isDragActive
    ? { borderColor: '#2285d7', background: '#e1f0fc' }
    : {};

  const dropBoxId = `${id}-dropbox`;

  // Keyboard accessibility: Space/Enter triggers click if focused.
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
      <label htmlFor="import-dataset-file-input" className="sr-only" id={`${id}-input-label`}>
        {strings.datasetImport.fileSelect}
      </label>
      <div
        id={dropBoxId}
        style={{
          padding: '24px 0',
          marginBottom: 12,
          background: '#eaf3fa',
          borderRadius: 16,
          border: `2px dashed ${isDragActive ? '#2285d7' : '#6daae2'}`,
          textAlign: 'center',
          position: 'relative',
          cursor: disabled ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'border-color 0.2s',
          ...uploadBoxStyle
        }}
        role="button"
        tabIndex={0}
        aria-label={strings.datasetImport.fileSelect}
        aria-disabled={disabled}
        aria-describedby={`${id}-input-label`}
        onClick={() => !disabled && fileInput.current.click()}
        onKeyDown={handleBoxKeyDown}
        onDrop={(e) => !disabled && handleDrop(e)}
        onDragOver={(e) => {
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
        <FontAwesomeIcon
          icon={faUpload}
          style={{ fontSize: 32, color: '#4a90e2', marginBottom: 6 }}
          aria-hidden="true"
        />
        <span
          id={`${id}-file-select`}
          style={{ color: '#2285d7', fontWeight: 500, margin: 5 }}
        >
          {strings.datasetImport?.fileSelect}
        </span>
      </div>
      {value && (
        <StyledImportedFileNameWrapper
          id={`${id}-file-info`}
          style={{
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center'
          }}
          role="status"
          aria-live="polite"
        >
          <span style={{ fontWeight: 600 }}>{strings.datasetImport.file}&nbsp;</span>
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
        <div
          id={`${id}-error`}
          role="alert"
          aria-live="assertive"
          style={{
            color: '#d32f2f',
            fontSize: 13,
            marginBottom: 10,
            marginTop: -8
          }}
        >
          {error}
        </div>
      )}
      <style>
        {`.sr-only { 
            border: 0 !important; 
            clip: rect(1px, 1px, 1px, 1px); 
            height: 1px; margin: -1px; overflow: hidden; padding: 0; 
            position: absolute; width: 1px; white-space: nowrap;
        }`}
      </style>
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
