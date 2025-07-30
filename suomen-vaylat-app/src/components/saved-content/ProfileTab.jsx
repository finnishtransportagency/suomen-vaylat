import styled from 'styled-components';

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
  font-size: 16px;
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

const ProfileTab = () => {
  const rows = [
    { title: "Etunimi", value: "Maija" },
    { title: "Sukunimi", value: "Meikäläinen" },
    { title: "Käyttäjätunnus", value: "LX123456789" },
    { title: "Sähköpostiosoite", value: "maija@email.com" },
    { title: "Tili luotu", value: "23.4.2020 08.34.43" },
    { title: "Edellinen kirjautuminen", value: "23.4.2024 12.02.09" }
  ];

  return (
    <StyledProfileInfo>
            <StyledSubtitle id="profile-tab-heading">
              {"Käyttäjän tiedot"}
            </StyledSubtitle>
      {rows.map((row, idx) => (
        <StyledProfileRow key={row.title + idx}>
          <StyledRowTitle>{row.title}</StyledRowTitle>
          <StyledRowValue>{row.value}</StyledRowValue>
        </StyledProfileRow>
      ))}
    </StyledProfileInfo>
  );
};

export default ProfileTab;
