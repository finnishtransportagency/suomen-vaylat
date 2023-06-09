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
  max-width: 600px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const StyledModalTitle = styled.h2`
  font-size: 24px;
  color: #333333;
`;

const StyledModalBody = styled.div`
  margin-top: 10px;
  color: #666666;
`;

export const CustomLayerModal = () => {
  return (
    <StyledModalWrapper>
      <StyledModalContent>
        <StyledModalTitle>{strings.layerlist.customLayerInfo.modalTitle}</StyledModalTitle>
        <StyledModalBody>
          <CustomLayerModalContent />
        </StyledModalBody>
      </StyledModalContent>
    </StyledModalWrapper>
  );
};