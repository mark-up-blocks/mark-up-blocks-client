import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import theme from "../../theme";

function MockTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

MockTheme.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MockTheme;
