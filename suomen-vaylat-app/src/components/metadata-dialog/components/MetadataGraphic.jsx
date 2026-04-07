import { useState } from 'react';
import { StyledImage } from './Common';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export const MetadataGraphic = ({ identification }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {identification &&
        identification.browseGraphics &&
        identification.browseGraphics.map((graphic, index) => {
          return (
            <>
                <StyledImage
                  key={'metadata-image-' + graphic.fileName + index}
                  src={graphic.fileName}
                  onClick={() => setOpen(true)}
                  style={{cursor: 'pointer'}}
                />

                <Lightbox
                  open={open}
                  close={() => setOpen(false)}
                  slides={[{ src: graphic.fileName }]}
                />
            </>
          );
        })}
    </>
  );
};

export default MetadataGraphic;
