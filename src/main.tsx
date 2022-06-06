import 'moment/locale/pt-br';

import moment from 'moment';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { CssBaseline } from '@mui/material';

import App from './App';
import { AuthProvider } from './hooks/useAuth';

moment.updateLocale("pt-br", null);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <ChakraProvider>
      <CookiesProvider>
        <Router>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </CookiesProvider>
    </ChakraProvider>
  </React.StrictMode>
);
