import React, { useContext, useEffect, useState } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import styled, { keyframes } from 'styled-components';
import Layer from './Layer';

export const Layers = ({ groupLayers, allLayers }) => {
    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    var filteredLayers = [];

    for (var i in groupLayers) {
        filteredLayers.push(allLayers.filter(layer => layer.id == groupLayers[i]));
    }
    return (
        <>
            {filteredLayers.map((layer, index) => {
                return (
                    <Layer layer={layer}></Layer>
            )})}
        </>
    );
  };

export default Layers;