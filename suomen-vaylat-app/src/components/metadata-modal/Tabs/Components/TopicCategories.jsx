import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const TopicCategories = ({ identification }) => {
    return (
        <>
        {identification.topicCategories && identification.topicCategories.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.topicCategory}</StyledTitle>
                <StyledUl>
                {identification.topicCategories.map((topicCategory, index) => {
                        return (
                            <StyledLi title={(strings.metadata.codeLists['gmd:MD_TopicCategoryCode'][topicCategory] || {description: topicCategory}).description} key={'metadata-topiccategory-li-' + index}>
                                {(strings.metadata.codeLists["gmd:MD_TopicCategoryCode"][topicCategory] || {label: topicCategory}).label}
                            </StyledLi>
                        )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default TopicCategories;