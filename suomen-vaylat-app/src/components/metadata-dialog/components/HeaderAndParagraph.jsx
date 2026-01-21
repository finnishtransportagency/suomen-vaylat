import React from 'react';
import 'moment-timezone';
import moment from 'moment';
import { StyledParagraph, StyledTitle } from './Common';

export const HeaderAndParagraph = ({ visible, header, title, text, momentFormat }) => {
    return (
        <React.Fragment key={'metadata-dialog-header-and-paragraph'}>
            {visible &&
                <React.Fragment key={'metadata-dialog-header-and-paragraph-content'}>
                    <StyledTitle>{header}</StyledTitle>
                    <StyledParagraph title={title}>
                        {momentFormat &&
                            <div>{moment(text).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm')}</div>
                        }
                        {!momentFormat &&
                            <React.Fragment key={'metadata-dialog-header-and-paragraph-content-text'}>
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