import { StyledArticle } from '../components/Common';
import LineageStatements from '../components/LineageStatements';
import QualityTabDataQualities from '../components/QualityTabDataQualities';

export const QualityTab = ({ identification, data, visible }) => {
    return (
        <StyledArticle visible={visible}>
            <LineageStatements lineageStatements={data.lineageStatements}></LineageStatements>
            <QualityTabDataQualities dataQualities={data.dataQualities}></QualityTabDataQualities>
        </StyledArticle>
    );
};

export default QualityTab;