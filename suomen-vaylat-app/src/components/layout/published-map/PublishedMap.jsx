import { useContext, useEffect } from 'react';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import ChannelHandler from './handlers/ChannelHandler';
import { setIsFullScreen } from '../../../state/slices/uiSlice';
import { setLoading } from '../../../state/slices/rpcSlice';
import SvLoader from '../../../utils/components/SvLoader';
import { useParams } from 'react-router';

const StyledPublishedMap = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const StyledLoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  height: 100%;
  max-width: 200px;
  max-height: 200px;
  transform: translate(-50%, -50%);
  svg {
    width: 100%;
    height: 100%;
    fill: none;
  }
`;

const PublishedMap = () => {
  const { store } = useContext(ReactReduxContext);
  const { loading } = useAppSelector((state) => state.rpc);

  const language = useAppSelector((state) => state.language);
  const iframeSrc = `${process.env.REACT_APP_PUBLISHED_MAP_URL}&lang=${language.current}`;

  const hideSpinner = () => {
    store.dispatch(setLoading(false));
  };

  let {zoom, x, y, themeId} = useParams();

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullScreen = Boolean(
        document.fullscreenElement ||
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullScreen
      );
      store.dispatch(setIsFullScreen(isFullScreen));
    };

    store.dispatch(setLoading(true));

    const isSharedLink = ((!isNaN(zoom) && x && y) || themeId);
    const iframe = document.getElementById('sv-iframe');
    const synchronizer = ChannelHandler({ iframe, store, isSharedLink});

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    return () => {
      synchronizer.destroy();
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullScreenChange
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullScreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullScreenChange
      );
    };
  }, [store]);

  return (
    <StyledPublishedMap>
      {loading && (
        <StyledLoaderWrapper>
          <SvLoader />
        </StyledLoaderWrapper>
      )}
      <StyledIframe
        id="sv-iframe"
        title="iframe"
        src={iframeSrc}
        allow="geolocation"
        onLoad={hideSpinner}
      />
    </StyledPublishedMap>
  );
};

export default PublishedMap;
