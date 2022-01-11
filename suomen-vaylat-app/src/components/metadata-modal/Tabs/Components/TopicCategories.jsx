import React from 'react';
import strings from '../../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const TopicCategories = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-topic-categories'}>
            {identification.topicCategories && identification.topicCategories.length > 0 &&
                <React.Fragment key={'metadata-modal-topic-categories-content'}>
                    <StyledTitle>{strings.metadata.heading.topicCategory}</StyledTitle>
                    <StyledUl>
                        {identification.topicCategories.map((topicCategory, index) => {
                            return (
                                <StyledLi title={(strings.metadata.codeLists['gmd:MD_TopicCategoryCode'][topicCategory] || { description: topicCategory }).description} key={'metadata-topiccategory-li-' + index}>
                                    {(strings.metadata.codeLists["gmd:MD_TopicCategoryCode"][topicCategory] || { label: topicCategory }).label}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default TopicCategories;