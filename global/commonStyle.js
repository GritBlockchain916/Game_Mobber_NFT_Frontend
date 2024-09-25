import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
  mainColor: `white`,
  accent: `rgba(239, 88, 123, 1)`,
  agreeSafe: `#5CE1E6`,
  borderColor: 'rgba(92, 92, 92, 1)'
}

export const fonts = {
  fantasy: 'fantasy',
}

export const redShadow = mainShadow('red')

export function redTextStroke() {
  return `2px ${colors.accent}`
}
export function mainShadow(color) {
  return `0px 0px 20px ${color}`
}

export const spinnerStyle = {
  border: '2px solid rgba(0, 0, 0, 0.1)', // Light gray border
  borderTop: '2px solid #3498db', // Blue border on top
  borderRadius: '50%',
  width: '16px', // Match font size
  height: '16px', // Match font size
  animation: 'spin 1s linear infinite',
  marginRight: '8px', // Space between spinner and text
  display: 'inline-block',
};

export const commonStyle = {
  // ----- Common Controls -----
  button: {
    padding: '14px',
    fontSize: '20px',
    color: 'white',
    backgroundColor: colors.accent,
    boxShadow: redShadow,
    borderRadius: '54px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  button3: {
    padding: Dimensions.get('window').width > 768 ? '14px': '8px',
    fontSize: '20px',
    color: 'white',
    backgroundColor: colors.accent,
    boxShadow: redShadow,
    borderRadius: '54px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  button2: {
    padding: '14px',
    fontSize: '20px',
    color: 'white',
    backgroundColor: 'grey',
    // boxShadow: redShadow,
    borderRadius: '54px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  toggleBtn1: {
    width: '60px',
    padding: '14px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: colors.accent,
    boxShadow: redShadow,
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  toggleBtn2: {
    width: '60px',
    padding: '14px',
    fontSize: '16px',
    color: 'black',
    backgroundColor: `rgba(188, 188, 188, 188)`,
    boxShadow: redShadow,
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'Horizon'
  },
  border: '1px solid '+ colors.borderColor
  // ----- Header -----

};
