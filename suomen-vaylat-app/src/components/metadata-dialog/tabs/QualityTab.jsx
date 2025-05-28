import { StyledArticle } from './Components/Common';
import LineageStatements from './Components/LineageStatements';
import QualityTabDataQualities from './Components/QualityTabDataQualities';

export const QualityTab = ({ identification, data, visible }) => {
    return (
        <StyledArticle visible={visible}>
            <LineageStatements lineageStatements={data.lineageStatements}></LineageStatements>
            <QualityTabDataQualities dataQualities={data.dataQualities}></QualityTabDataQualities>
        </StyledArticle>
    );
};

export default QualityTab;