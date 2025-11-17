import OskariRPC from 'oskari-rpc';
import setupSupportedFunctions from '../setup/ChannelSetup';
import MapEventsHandler from './MapEventsHandler';
import { setChannel, setGeometries, setStartState, setViews } from '../../../../state/slices/rpcSlice';

const ChannelHandler = ({ iframe, store, isSharedLink }) => {
  const channel = OskariRPC.connect(
    iframe,
    process.env.REACT_APP_PUBLISHED_MAP_DOMAIN
  );

  const handlers = [];

  channel.onReady(() => {
    store.dispatch(setChannel(channel));

    channel.getSupportedFunctions && channel.getSupportedFunctions((data) => {
      setupSupportedFunctions(data, channel, store, isSharedLink);
    });

    channel.getSupportedEvents && channel.getSupportedEvents((data) => {
      MapEventsHandler({ channel, store });
    });

    channel.getPublishedMapState && channel.getPublishedMapState((data) => {
      store.dispatch(setStartState(data));
    });


    const storedGeometries = window.localStorage.getItem('geometries');
    const geometriesArray = JSON.parse(storedGeometries);
    if (storedGeometries) store.dispatch(setGeometries(geometriesArray));

    const storedViews = window.localStorage.getItem('views');
    const viewsArray = JSON.parse(storedViews);
    if (storedViews) store.dispatch(setViews(viewsArray));
  });

  var synchronizer = OskariRPC.synchronizerFactory(channel, handlers);
  synchronizer.synchronize();

  return synchronizer;
};

export default ChannelHandler;
