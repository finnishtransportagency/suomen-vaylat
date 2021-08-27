import styled from 'styled-components';
import { SRLWrapper } from 'simple-react-lightbox';

const StyledImage = styled.img`
    max-height: 200px;
    cursor: zoom-in;
`;

export const MetadataGraphic = ({ identification }) => {
    return (
        <SRLWrapper>
        {identification && identification.browseGraphics && identification.browseGraphics.map((graphic, index) => {
                    return (
                        <a href={graphic.fileName}>
                            <StyledImage src={graphic.fileName}/>
                        </a>
                    )
                    })}
        </SRLWrapper>
    );
};

export default MetadataGraphic;