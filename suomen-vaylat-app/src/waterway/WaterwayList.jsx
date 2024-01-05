import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import strings from "../translations";
import { theme } from '../theme/theme';

import styled from 'styled-components';

const StyledWaterwayList = styled.div`
    padding: 20px;
    background-color: #f5f5f5;
`;

const StyledLayer = styled.div`
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const StyledLayerName = styled.h3`
    color: #333;
    font-size: 18px;
`;

const StyledLegendImage = styled.img`
    width: 100%;
    height: auto;
`;

const WaterwayList = ({ layers }) => {
    console.log(layers);
    return (
        <div>
            <h2>Waterway List</h2>
            {/* Display layers here using the layers prop */}
            {layers && layers.map(layer => (
                <div key={layer.id}>
                    {/* Render each layer's information */}
                    <p>{layer.name}</p>
                    {/* Add more information if needed */}
                </div>
            ))}
        </div>
    );
};

export default WaterwayList;
