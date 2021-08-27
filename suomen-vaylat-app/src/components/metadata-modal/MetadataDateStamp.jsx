import styled from 'styled-components';
import strings from '../../translations';
import Moment from 'react-moment';
import 'moment-timezone';

const StyledDateStampTitle = styled.h5`
`;

export const MetadataDateStamp = ({ datestamp }) => {
    return (
        <>
        {datestamp && datestamp.length > 0 &&
            <>
                <StyledDateStampTitle>{strings.metadata.heading.metadataDateStamp}</StyledDateStampTitle>
                <p>
                    <Moment format="DD.MM.YYYY hh:mm:ss" tz="Europe/Helsinki">{datestamp}</Moment>
                </p>
            </>
        }
        </>
    );
};

export default MetadataDateStamp;