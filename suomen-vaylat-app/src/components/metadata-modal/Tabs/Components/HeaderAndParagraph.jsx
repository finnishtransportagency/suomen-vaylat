import {StyledParagraph, StyledTitle} from './Common';
import Moment from 'react-moment';
import 'moment-timezone';


export const HeaderAndParagraph = ({ visible, header, title, text, momentFormat }) => {
    return (
        <>
        {visible &&
            <>
                <StyledTitle>{header}</StyledTitle>
                <StyledParagraph title={title}>
                    {momentFormat &&
                        <Moment format={momentFormat} tz="Europe/Helsinki">{text}</Moment>
                    }
                    {!momentFormat &&
                        <>
                        {text}
                        </>
                    }
                </StyledParagraph>
            </>
        }
        </>
    );
};

export default HeaderAndParagraph;