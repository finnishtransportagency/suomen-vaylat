import { SRLWrapper } from 'simple-react-lightbox';
import {StyledA, StyledImage} from './Common';

export const MetadataGraphic = ({ identification }) => {
    const options = {
        buttons: {
            showAutoplayButton: true,
            showCloseButton: true,
            showDownloadButton: false,
            showFullscreenButton: false,
            showNextButton: true,
            showPrevButton: true,
            showThumbnailsButton: false
        }
    };
    return (
        <SRLWrapper options={options}>
        {identification && identification.browseGraphics && identification.browseGraphics.map((graphic, index) => {
                    return (
                        <StyledA key={'metadata-image-a-' + graphic.fileName + index} href={graphic.fileName}>
                            <StyledImage key={'metadata-image-' + graphic.fileName + index} src={graphic.fileName}/>
                        </StyledA>
                    )
                    })}
        </SRLWrapper>
    );
};

export default MetadataGraphic;