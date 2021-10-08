import React from 'react';
import 'moment-timezone';
import Moment from 'react-moment';
import { StyledParagraph, StyledTitle } from './Common';

export const HeaderAndParagraph = ({ visible, header, title, text, momentFormat }) => {
    return (
        <React.Fragment key={'metadata-modal-header-and-paragraph'}>
            {visible &&
                <React.Fragment key={'metadata-modal-header-and-paragraph-content'}>
                    <StyledTitle>{header}</StyledTitle>
                    <StyledParagraph title={title}>
                        {momentFormat &&
                            <Moment format={momentFormat} tz="Europe/Helsinki">{text}</Moment>
                        }
                        {!momentFormat &&
                            <React.Fragment key={'metadata-modal-header-and-paragraph-content-text'}>
                                {text}
                            </React.Fragment>
                        }
                    </StyledParagraph>
                </React.Fragment>
            }
        </React.Fragment>
    );
};

export default HeaderAndParagraph;