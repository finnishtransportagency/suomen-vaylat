import { ThemeProvider } from "styled-components";

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
};

const theme = {
    fonts: {
      main: 'Exo 2'
    },
    colors: {
        mainColor1: "#0064af",
        mainColor2: "#009ae1",
        mainColor3: "#49c2f1",
        mainColorselected1: "#024c85",
        secondaryColor1: "#00b0cc",
        secondaryColor2: "#207a43",
        secondaryColor3: "#8dcb6d",
        secondaryColor4: "#ffc300",
        secondaryColor5: "#910aa3",
        secondaryColor6: "#c73f00",
        secondaryColor7: "#ff5100",
        secondaryColor8: "#e50083",
        black: "#000000",
        mainWhite: "#ffffff",
        button: "#0064af",
        buttonActive: "#004477",
    },
    device: {
      mobileS: `(max-width: ${size.mobileS})`,
      mobileM: `(max-width: ${size.mobileM})`,
      mobileL: `(max-width: ${size.mobileL})`,
      tablet: `(max-width: ${size.tablet})`,
      laptop: `(max-width: ${size.laptop})`,
      laptopL: `(max-width: ${size.laptopL})`,
      desktop: `(max-width: ${size.desktop})`,
      desktopL: `(max-width: ${size.desktop})`
    }
};

const appHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight();

const Theme = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

export default Theme;