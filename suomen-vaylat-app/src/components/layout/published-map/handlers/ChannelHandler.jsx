import OskariRPC from 'oskari-rpc';
import setupSupportedFunctions from '../setup/ChannelSetup';
import MapEventsHandler from './MapEventsHandler';
import { setChannel, setStartState } from '../../../../state/slices/rpcSlice';

const ChannelHandler = ({ iframe, store }) => {
  const channel = OskariRPC.connect(
    iframe,
    process.env.REACT_APP_PUBLISHED_MAP_DOMAIN
  );

  const handlers = [];

  channel.onReady(() => {
    store.dispatch(setChannel(channel));

    channel.getSupportedFunctions((data) => {
      setupSupportedFunctions(data, channel, store);
    });

    channel.getSupportedEvents((data) => {
      MapEventsHandler({ channel, store });
    });

    channel.getPublishedMapState((data) => {
      store.dispatch(setStartState(data));
    });
  });

  var synchronizer = OskariRPC.synchronizerFactory(channel, handlers);
  synchronizer.synchronize();

  return synchronizer;
};

export default ChannelHandler;
