import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppView from './app/views/components/appView/appView';
const theme = createTheme({
  palette: {
    background: {
      default: "#EBEDF0"
    }
  },
});

var view = (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppView/>
  </ThemeProvider>
);

const root = ReactDOM.createRoot(document.getElementById('reactapp'));
root.render(view);
