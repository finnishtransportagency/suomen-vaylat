import styled from 'styled-components';
import { SRLWrapper } from 'simple-react-lightbox';
import {StyledImage} from './Common';

export const MetadataGraphic = ({ identification }) => {
    return (
        <SRLWrapper>
        {identification && identification.browseGraphics && identification.browseGraphics.map((graphic, index) => {
                    return (
                        <a key={'metadata-image-a-' + graphic.fileName + index} href={graphic.fileName}>
                            <StyledImage key={'metadata-image-' + graphic.fileName + index} src={graphic.fileName}/>
                        </a>
                    )
                    })}
        </SRLWrapper>
    );
};

export default MetadataGraphic;