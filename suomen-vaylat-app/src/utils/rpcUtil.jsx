import { setAllLayers, setSelectedLayers } from "../state/slices/rpcSlice";

export const updateLayers = (store, channel) => {
    channel && channel.getAllLayers(function (data) {
        store.dispatch(setAllLayers(data));
    });
    channel && channel.getSelectedLayers(function (data) {
        store.dispatch(setSelectedLayers(data));
    });
}