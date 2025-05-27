import strings from '../../translations';
import styled from 'styled-components';
import filterImg from './images/filter_img.png'

const InstructionsContainer = styled.div`
  margin-bottom: 1rem;
`;

const StepImage = styled.img`
  max-width: 100%;  /* Ensures the image does not overflow its container */
  height: auto;     /* Maintains the image's aspect ratio */
  display: inline-block; /* Aligns the image inline with other text or elements */
  margin: 0;        /* Removes automatic centering adjustments */
  border-radius: 8px;
`;

const StepTitle = styled.h4`
  margin-top: 10px;
  font-size: 18px;
  font-weight: 550;
  color: ${(props) => props.theme.colors.black}; // Emphasizes titles with different color
  text-align: left;  // Aligns left for readability
`;

const StepContent = styled.div`
  font-size: 16px;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.black};
`;

const StyledList = styled.ol`
  padding-inline-start: 20px;
`;

const UserGuideFilterContent = () => {
  // Use strings to access each content piece
  const stepsContent = [
    {
      step: 1,
      title: strings.appGuide.dialogContent.filter.steps.step1.title || '',
      content: <StepImage src={filterImg} alt="Filter Button Image" />,
    },
    {
      step: 2,
      title: strings.appGuide.dialogContent.filter.steps.step2.title || '',
      content: strings.appGuide.dialogContent.filter.steps.step2.content || '',
    },
    {
      step: 3,
      title: strings.appGuide.dialogContent.filter.steps.step3.title || '',
      content: (
        <ul>
          <li dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.steps.step3.content.equal || '' }}/>
          <li dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.steps.step3.content.notEqual || '' }}/>
          <li dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.steps.step3.content.contains || '' }}/>
          <li dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.steps.step3.content.notContains || '' }}/>
          <li dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.steps.step3.content.smallerThan || '' }}/>
          <li dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.steps.step3.content.biggerThan || '' }}/>
        </ul>
      ),
    },
    {
      step: 4,
      title: strings.appGuide.dialogContent.filter.steps.step4.title || '',
      content: strings.appGuide.dialogContent.filter.steps.step4.content || '',
    },
    {
      step: 5,
      title: strings.appGuide.dialogContent.filter.steps.step5.title || '',
      content: '',
    },
    {
      step: 6,
      title: strings.appGuide.dialogContent.filter.steps.step6.title || '',
      content: strings.appGuide.dialogContent.filter.steps.step6.content || '',
    },
  ];

  return (
    <InstructionsContainer>
      <StyledList>
        {stepsContent.map(({ step, title, content }) => (
          <li key={step}>
            <StepTitle>{title}</StepTitle>
            <StepContent>{content}</StepContent>
          </li>
        ))}
      </StyledList>
      <StepContent dangerouslySetInnerHTML={{ __html: strings.appGuide.dialogContent.filter.additionalInstructions || '' }}/>
      <StepContent>
        {strings.appGuide.dialogContent.filter.feedback || ''}{' '}
        <a href={`mailto:${strings.appGuide.dialogContent.filter.feedbackEmail}`}>
          {strings.appGuide.dialogContent.filter.feedbackEmail}
        </a>
      </StepContent>
    </InstructionsContainer>
  );
};

export default UserGuideFilterContent;
