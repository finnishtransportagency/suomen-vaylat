import { useContext } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { setLocale } from '../../state/slices/languageSlice';
import { changeLayerStyle, reArrangeSelectedMapLayers, setLegends } from '../../state/slices/rpcSlice';
import { setIsSideMenuOpen, setSelectedTheme } from '../../state/slices/uiSlice';
import { Logger } from '../../utils/logger';
import { updateLayers } from '../../utils/rpcUtil';

const LOG = new Logger('HandleSharedWebSiteLink');

/**
 * HandleSharedWebSiteLink component handles map state when come in via shared url.
 * @param {Integer} zoom zoom level
 * @param {Float} x center x coordinate
 * @param {Float} y center y coordinate
 * @param {String} mapLayers map layers <layerId1>+<opacity1>+<style1>++<layerId2>+<opacity2>+<style2>
 */
export const HandleSharedWebSiteLink = () => {
    let {zoom, x, y, maplayers, themename, lang} = useParams();
    zoom = parseInt(zoom);
    x = parseInt(x);
    y = parseInt(y);

    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    if ((zoom && x && y) || themename) {
        LOG.log('The page was accessed via a link, initializing the map according to the link.');
    }

    // if channel ready and zoom given without xx and y, zoom map to wanted zoom
    if (channel && zoom && !x && !y) {
        channel.zoomTo([zoom], function () {});
    }
    // if channel ready and zoom, x and y given, zoom map to wanted location and zoom
    if (channel && zoom && x && y) {
        channel.postRequest('MapMoveRequest', [x, y, zoom]);
    }

    if (lang) {
        store.dispatch(setLocale(lang));
    }

    // If theme given then select wanted theme
    if (themename) {
        store.dispatch(setIsSideMenuOpen(true));
        store.dispatch(setSelectedTheme(themename));
    }
    // else if mapLayers given, add wanted layers to map
    else if (channel && maplayers) {
        const layers = maplayers.split('++');
        layers.reverse().forEach((l, index) => {
            const layerProps = l.split('+');
            if (layerProps.length === 3) {
                const layerId = parseInt(layerProps[0]);
                const opacity = parseInt(layerProps[1]);
                const style = layerProps[3];

                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
                channel.postRequest('ChangeMapLayerOpacityRequest', [layerId, opacity]);
                store.dispatch(changeLayerStyle({layerId: layerId, style:style}));

                // Update layer orders to correct
                store.dispatch(reArrangeSelectedMapLayers({layerId: layerId, position: index}));
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