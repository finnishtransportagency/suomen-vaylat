import Select from 'react-select';
import styled from 'styled-components';


const StyledLayerSearchContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const FormLayerSearch = ({ layers, onLayerSelect  }) => {

    const options = layers.map(layer => ({ value: layer.id, label: layer.name }));

    return (
        <StyledLayerSearchContainer>
            <Select
                isMulti
                name="layers"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={onLayerSelect}
            />
        </StyledLayerSearchContainer>
    )
};

export default FormLayerSearch;