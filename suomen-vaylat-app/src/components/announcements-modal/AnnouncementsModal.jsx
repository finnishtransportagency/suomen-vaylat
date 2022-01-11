import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { Button } from "react-bootstrap";

const StyledCheckbox = styled.input`
    margin-right: 7px;
`;

const StyledContent = styled.div`
    padding: 32px;
    max-width: 600px;
`;

const StyledFooter = styled.div`
    justify-content: space-between;
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: #0064af;
`;

export const AnnouncementsModal = ({
    id,
    content,
    handleAnnouncementModal
    }) => {

    const [checked, setChecked] = useState(false);

    return (
            <StyledContent>
                {content}
                <StyledFooter className='modal-footer'>
                    <label>
                        <StyledCheckbox
                            name='announcementSelected'
                            type='checkbox'
                            onChange={() => setChecked(!checked)}
                            checked={checked}
                        />
                        {strings.general.dontShowAgain}
                    </label>
                    <StyledButton onClick={() => handleAnnouncementModal(checked, id)}>{strings.general.ok}</StyledButton>
                </StyledFooter>
            </StyledContent>
    );
}
export default AnnouncementsModal;