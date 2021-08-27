import styled from 'styled-components';

const StyledBrowseGraphic = styled.div`
    cursor: zoom-in;
    display: table-cell;
    margin-bottom: 6px;
    margin-left: 6px;
`;

const StyledImage = styled.img`
    max-height: 200px;
`;

export const MetadataGraphic = ({ identification }) => {
    return (
        <>
        {identification && identification.browseGraphics && identification.browseGraphics.map((graphic, index) => {
                    return (
                        <StyledBrowseGraphic
                            key={'metadata-graphic-' + index + '-' + graphic.fileName}
                        >
                            <StyledImage src={graphic.fileName}/>
                        </StyledBrowseGraphic>
                    )
                    })}
        </>
    );
};

export default MetadataGraphic;