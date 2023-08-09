import { CustomLayerModalContent } from "./CustomLayerModalContent";
import strings from "../../../translations";
import styled from "styled-components"; 

const StyledModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
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

const StyledModalTitle = styled.h2`
  margin-left: 10px;
  font-size: 24px;
  color: #333333;
`;

const StyledModalBody = styled.div`
  margin-top: 5px;
  color: #666666;
`;

export const CustomLayerModal = () => {
  return (
    <StyledModalWrapper>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <StyledModalContent>
        <StyledModalTitle>{strings.layerlist.customLayerInfo.modalTitle}</StyledModalTitle>
        <StyledModalBody>
          <CustomLayerModalContent />
        </StyledModalBody>
      </StyledModalContent>
    </StyledModalWrapper>
  );
};