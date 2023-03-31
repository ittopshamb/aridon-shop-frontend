import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import LoginPage from "../../features/auth/LoginPage";
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import ProductsPage from "../../features/catalog/ProductsPage";
import NotfoundPage from "../../features/NotfoundPage";
import {Login} from "@mui/icons-material";


const sections = [
  { title: 'Technology', url: '#' },
  { title: 'Design', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Business', url: '#' },
  { title: 'Politics', url: '#' },
  { title: 'Opinion', url: '#' },
  { title: 'Science', url: '#' },
  { title: 'Health', url: '#' },
  { title: 'Style', url: '#' },
  { title: 'Travel', url: '#' },
];



const theme = createTheme();

export default function MainLayout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Router>
            <Header />
            <main>
              <Grid container spacing={5} sx={{ mt: 3 }}>
                {/*подставляется страница, которая выбрана на текущий момент: */}
                {/*<LoginPage />*/}
              </Grid>
            </main>
            <Routes>
                <Route path="/Products" element={<ProductsPage/>}/>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="*" element={<NotfoundPage/>}/>
            </Routes>
        </Router>
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}
