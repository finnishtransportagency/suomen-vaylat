import { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { setLegends } from '../../state/slices/rpcSlice';
import { updateLayers } from '../../utils/rpcUtil';

/**
 * HandleSharedWebSiteLink component handles map state when come in via shared url.
 * @param {Integer} zoom zoom level
 * @param {Float} x center x coordinate
 * @param {Float} y center y coordinate
 * @param {String} mapLayers map layers <layerId1>+<opacity1>+<style1>++<layerId2>+<opacity2>+<style2>
 */
export const HandleSharedWebSiteLink = () => {
    let {zoom, x, y, maplayers} = useParams();
    zoom = parseInt(zoom);
    x = parseInt(x);
    y = parseInt(y);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    // if channel ready and zoom given without xx and y, zoom map to wanted zoom
    if (channel && zoom && !x && !y) {
        channel.zoomTo([zoom], function () {});
    }
    // if channel ready and zoom, x and y given, zoom map to wanted location and zoom
    if (channel && zoom && x && y) {
        channel.postRequest('MapMoveRequest', [x, y, zoom]);
    }

    // if mapLayers given, add wanted layers to map
    if (channel && maplayers) {
        const layers = maplayers.split('++');
        layers.reverse().forEach((l, index) => {
            const layerProps = l.split('+');
            if (layerProps.length === 3) {
                const layerId = parseInt(layerProps[0]);
                const opacity = parseInt(layerProps[1]);
                const style = layerProps[3];

                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                channel.postRequest('ChangeMapLayerOpacityRequest', [layerId, opacity]);
                channel.changeLayerStyle([layerId, style], function() {});

                // Update layer orders to correct
                channel.reorderLayers([layerId, index], () => {});
            }
        });
    }

    // update map legend to redux
    channel && channel.getLegends((data) => {
        store.dispatch(setLegends(data));
    });

    // last update layers to redux
    updateLayers(store, channel);
    return (<></>);
};