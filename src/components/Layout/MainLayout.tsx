import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import LoginPage from "../../features/auth/LoginPage";
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import CategoriesPage from "../../features/catalog/CategoriesPage";
import NotfoundPage from "../../features/NotfoundPage";
import SignupPage from "../../features/auth/SignupPage";
import ProductsPage from "../../features/catalog/ProductsPage";
import AccountPage from "../../features/auth/AccountInfoPage";
import ProductCardPage from "../../features/catalog/ProductCardPage";
import CartPage from "../../features/ordering/CartPage";
import AddProductPage from "../../features/AdminAuthority/AddProductPage";
import UpdateProductPage from "../../features/AdminAuthority/UpdateProductPage";
import MainPage from "../../features/MainPage";
import UpdateParentCategoryPage from "../../features/AdminAuthority/UpdateParentCategoryPage";
import UpdateCategoryPage from "../../features/AdminAuthority/UpdateCategoryPage";
import AddParentCategoryPage from "../../features/AdminAuthority/AddParentCategoryPage";
import AddCategoryPage from "../../features/AdminAuthority/AddCategoryPage";

const theme = createTheme();


export default function MainLayout() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Router basename={import.meta.env.BASE_URL}>
                    <Header />
                    <main>
                        <Grid container spacing={5} sx={{ mt: 3 }}>
                            {/*подставляется страница, которая выбрана на текущий момент: */}
                            {/*<LoginPage />*/}
                        </Grid>
                    </main>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/Categories" element={<CategoriesPage/>}/>
                        <Route path="/Products" element={<ProductsPage/>} />
                        <Route path="/Products/:categoryId" element={<ProductsPage/>} />
                        <Route path="/Product/:productId" element={<ProductCardPage/>} />
                        <Route path="/ProductAdd" element={<AddProductPage/>} />
                        <Route path="/ParentCategoriesAdd" element={<AddParentCategoryPage/>} />
                        <Route path="/CategoriesAdd" element={<AddCategoryPage/>} />
                        <Route path="/ProductUpdate/:productId" element={<UpdateProductPage/>} />
                        <Route path="/ParentCategoryUpdate/:parentCategoryId" element={<UpdateParentCategoryPage/>}/>
                        <Route path="/CategoryUpdate/:categoryId" element={<UpdateCategoryPage/>}/>
                        <Route path="/Login" element={<LoginPage/>}/>
                        <Route path="/Signup" element={<SignupPage/>}/>
                        <Route path="/Account" element={<AccountPage />}/>
                        <Route path="/Cart" element={<CartPage />}/>
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