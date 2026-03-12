import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { Button } from "react-bootstrap";

const StyledCheckbox = styled.input`
    margin-right: 7px;
`;

const StyledContent = styled.div`
    padding: 1em;
`;

const StyledFooter = styled.div`
    display: flex;
    gap: 8px;
    align-items: baseline;
    justify-content: space-between;
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: #0064af;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d7d9db;
  margin: 1em 0;
`;

export const AnnouncementsDialogContent = ({
    id,
    content,
    handleAnnouncementDialog
    }) => {

    const [checked, setChecked] = useState(false);

    return (
            <StyledContent>
                <div className='announcements-content' dangerouslySetInnerHTML={{ __html: content }}></div>
                <HorizontalLine/>
                <StyledFooter className='dialog-footer'>
                    <label>
                        <StyledCheckbox
                            name='announcementSelected'
                            type='checkbox'
                            onChange={() => setChecked(!checked)}
                            checked={checked}
                        />
                        {strings.general.dontShowAgain}
                    </label>
                    <StyledButton onClick={() => handleAnnouncementDialog(checked, id)}>{strings.general.ok}</StyledButton>
                </StyledFooter>
            </StyledContent>
    );
}
export default AnnouncementsDialogContent;