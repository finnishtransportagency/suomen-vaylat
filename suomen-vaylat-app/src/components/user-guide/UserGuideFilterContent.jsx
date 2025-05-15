import strings from '../../translations';
import styled from 'styled-components';
import filterImg from './images/filter_img.png'

const InstructionsContainer = styled.div`
  margin-bottom: 1rem;
`;

const StepImage = styled.img`
  width: 80%;  // Reduces width for better balancing
  height: auto;
  margin: 10px auto;
  display: block; // Centers image
  border-radius: 8px;
`;

const StepTitle = styled.h4`
  margin-top: 10px;
  font-size: 18px;
  color: ${(props) => props.theme.colors.black}; // Emphasizes titles with different color
  text-align: left;  // Aligns left for readability
`;

const StepContent = styled.div`
  font-size: 16px;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.black};
`;

const UserGuideFilterContent = () => {
  // Use strings to access each content piece
  const stepsContent = [
    {
      step: 1,
      title: strings.appGuide.modalContent.filter.steps.step1.title || '',
      content: <StepImage src={filterImg} alt="Filter Button Image" />,
    },
    {
      step: 2,
      title: strings.appGuide.modalContent.filter.steps.step2.title || '',
      content: strings.appGuide.modalContent.filter.steps.step2.content || '',
    },
    {
      step: 3,
      title: strings.appGuide.modalContent.filter.steps.step3.title || '',
      content: (
        <ul>
          <li>{strings.appGuide.modalContent.filter.steps.step3.content.equal || ''}</li>
          <li>{strings.appGuide.modalContent.filter.steps.step3.content.notEqual || ''}</li>
          <li>{strings.appGuide.modalContent.filter.steps.step3.content.contains || ''}</li>
          <li>{strings.appGuide.modalContent.filter.steps.step3.content.notContains || ''}</li>
          <li>{strings.appGuide.modalContent.filter.steps.step3.content.smallerThan || ''}</li>
          <li>{strings.appGuide.modalContent.filter.steps.step3.content.biggerThan || ''}</li>
        </ul>
      ),
    },
    {
      step: 4,
      title: strings.appGuide.modalContent.filter.steps.step4.title || '',
      content: strings.appGuide.modalContent.filter.steps.step4.content || '',
    },
    {
      step: 5,
      title: strings.appGuide.modalContent.filter.steps.step5.title || '',
      content: '',
    },
    {
      step: 6,
      title: strings.appGuide.modalContent.filter.steps.step6.title || '',
      content: strings.appGuide.modalContent.filter.steps.step6.content || '',
    },
  ];

  return (
    <InstructionsContainer>
      <ol>
        {stepsContent.map(({ step, title, content }) => (
          <li key={step}>
            <StepTitle>{title}</StepTitle>
            <StepContent>{content}</StepContent>
          </li>
        ))}
      </ol>
      <StepContent>{strings.appGuide.modalContent.filter.additionalInstructions || ''}</StepContent>
      <StepContent>
        {strings.appGuide.modalContent.filter.feedback || ''}{' '}
        <a href={`mailto:${strings.appGuide.modalContent.filter.feedbackEmail}`}>
          {strings.appGuide.modalContent.filter.feedbackEmail}
        </a>
      </StepContent>
    </InstructionsContainer>
  );
};

export default UserGuideFilterContent;
