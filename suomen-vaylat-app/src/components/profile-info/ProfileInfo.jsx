import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';

// Card-style wrapper
const StyledProfileInfo = styled.div`
  background: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 0; /* No gap here, row spacing is in row style */
`;

// Row: grid with two columns, no center align!
const StyledProfileRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: flex-start;
  padding: 13px 0 13px 0;
  border-bottom: 1px solid #f0f0f3;
  gap: 1em;

  &:last-child {
    border-bottom: none;
  }
`;

const StyledRowTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme?.colors?.black};
  text-align: left;
  font-family: 'Inter', Arial, sans-serif;
`;

const StyledRowValue = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #444;
  text-align: left;
  font-family: 'Inter', Arial, sans-serif;
  word-break: break-word;
`;

const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme?.colors?.mainColor1};
  margin-bottom: 1em;
`;

const ProfileInfo = () => {
  const { loggedInUser } = useAppSelector((state) => state.rpc);
  const rows = [
    {
      title: strings.profile?.firstName,
      value: loggedInUser?.user?.etunimi
    },
    {
      title: strings.profile?.lastName,
      value: loggedInUser?.user?.sukunimi
    },
    {
      title: strings.profile?.email,
      value: loggedInUser?.user?.email
    },
    {
      title: strings.profile?.username,
      value: loggedInUser?.user?.uid
    }
  ];

  return (
    <StyledProfileInfo>
      <StyledSubtitle id="profile-tab-heading">
        {strings.profile?.title}
      </StyledSubtitle>
      {rows.map((row, idx) => (
        <StyledProfileRow key={row?.title + idx}>
          <StyledRowTitle>{row?.title}</StyledRowTitle>
          <StyledRowValue>{row?.value}</StyledRowValue>
        </StyledProfileRow>
      ))}
    </StyledProfileInfo>
  );
};

export default ProfileInfo;
