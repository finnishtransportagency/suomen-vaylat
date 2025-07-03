import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';

export default function ZipFileInput({
  value,
  onFileChange,
  error,
  setError,
  disabled,
  children,
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
      return 'Vain zip-tiedostot ovat sallittuja.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'Zip-tiedoston maksimikoko on 10 Mt.';
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

  return (
    <>
      {children}
      <div
        style={{
          padding: '24px 0',
          marginBottom: 16,
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
        onClick={() => !disabled && fileInput.current.click()}
        onDrop={(e) => !disabled && handleDrop(e)}
        onDragOver={(e) => {
          if (!disabled) {
            e.preventDefault();
            setIsDragActive(true);
          }
        }}
        onDragLeave={() => !disabled && setIsDragActive(false)}
        tabIndex={0}
        aria-disabled={disabled}
      >
        <input
          ref={fileInput}
          type="file"
          accept=".zip"
          hidden
          disabled={disabled}
          onChange={disabled ? undefined : handleInput}
        />
        <FontAwesomeIcon
          icon={faUpload}
          style={{ fontSize: 32, color: '#4a90e2', marginBottom: 6 }}
        />
        <span style={{ color: '#2285d7', fontWeight: 500, marginBottom: 5 }}>
          {strings.datasetImport.fileSelect}
        </span>
      </div>
      {value && (
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span style={{ fontWeight: 600 }}>{strings.datasetImport.file}&nbsp;</span>
          <span
            style={{
              color: '#2285d7',
              fontWeight: 500,
              marginRight: 4
            }}
          >
            {value.name} ({(value.size / 1024 / 1024).toFixed(2)} Mt)
          </span>
          <IconButton
            size="small"
            sx={{ marginLeft: 1, color: '#c00' }}
            onClick={() => {
              onFileChange(null);
              setError('');
            }}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>
      )}
      {error && (
        <div
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
    </>
  );
}

ZipFileInput.propTypes = {
  value: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node
};
