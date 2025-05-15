import { CustomLayerModalContent } from "./CustomLayerModalContent";
import styled from "styled-components"; 

const StyledModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledModalContent = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 350px) {
    margin-left: 5px;
    min-width: 300px;
    max-width: 450px;
  }
`;

const StyledModalBody = styled.div`
  margin-top: 5px;
  color:  ${(props) => props.theme.colors.black};
`;

export const CustomLayerModal = () => {
  return (
    <StyledModalWrapper>
      <StyledModalContent>
        <StyledModalBody>
          <CustomLayerModalContent />
        </StyledModalBody>
      </StyledModalContent>
    </StyledModalWrapper>
  );
};