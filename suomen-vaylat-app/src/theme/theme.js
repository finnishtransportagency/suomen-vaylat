import { ThemeProvider } from 'styled-components';

var isMobileTest = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  iPad: function() {
    return /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (isMobileTest.Android() || isMobileTest.BlackBerry() || isMobileTest.iOS() || isMobileTest.iPad() || isMobileTest.Opera() || isMobileTest.Windows());
  }};

export const isMobile = isMobileTest.any();

export const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '430px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1640px',
  desktop: '2560px'
};

export const theme = {
    fonts: {
      main: 'Exo 2'
    },
    colors: {
        mainColor1: '#0064af',
        mainColor2: '#009ae1',
        mainColor3: '#49c2f1',
        mainColor3transparent30: '#49c2f130',
        mainColor3transparent80: '#49c2f180',
        mainColorselected1: '#024c85',
        mainColor1Selected: '#024c85',
        secondaryColorLightBlue: '#00b0cc',
        secondaryColorGreen: '#207a43',
        secondaryColorGreenSelected: '#1b6537',
        secondaryColorLightGreen: '#8dcb6d',
        secondaryColorYellow: '#ffc300',
        secondaryColorPurple: '#910aa3',
        secondaryColorDarkOrange: '#c73f00',
        secondaryColorDarkOrangeSelected: '#ab3a06',
        secondaryColorOrange: '#ff5100',
        secondaryColorPink: '#e50083',
        black: '#000000',
        mainWhite: '#ffffff',
        button: '#0064af',
        buttonSelected: '#004477',
        transparentMain: '#80dbff40',
        hover: '#f0f0f0',
        darkGrey: '#717070',
        lightGrey: '#D7D9DB',
        disabledBg: '#ccc',
        disabledColor: '#66666680'
    },
    device: {
      mobileS: `(max-width: ${size.mobileS})`,
      mobileM: `(max-width: ${size.mobileM})`,
      mobileL: `(max-width: ${size.mobileL})`,
      tablet: `(max-width: ${size.tablet})`,
      laptop: `(max-width: ${size.laptop})`,
      laptopL: `(max-width: ${size.laptopL})`,
      desktop: `(max-width: ${size.desktop})`,
      lowResDesktop: `(max-height: 756px)`,
    }
};

export const isTabletOrLarger = () => {
  return window.innerWidth >= parseInt(size.tablet); // use parseInt to convert `${size.tablet}` to a number
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