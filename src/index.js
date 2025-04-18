import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SnackbarProvider } from 'notistack';
import RedirectPage from './components/RedirectPage';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto Flex',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <SnackbarProvider
            preventDuplicate
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<App />} />
                <Route path="/oauth2/callback" element={<RedirectPage />} />
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </DndProvider>
      </Provider>
    </React.StrictMode>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
