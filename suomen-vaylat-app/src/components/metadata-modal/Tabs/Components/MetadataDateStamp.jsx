import strings from '../../../../translations';
import Moment from 'react-moment';
import 'moment-timezone';
import {StyledTitle} from './Common';


export const MetadataDateStamp = ({ datestamp }) => {
    return (
        <>
        {datestamp && datestamp.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.metadataDateStamp}</StyledTitle>
                <p>
                    <Moment format="DD.MM.YYYY hh:mm:ss" tz="Europe/Helsinki">{datestamp}</Moment>
                </p>
            </>
        }
        </>
    );
};

export default MetadataDateStamp;