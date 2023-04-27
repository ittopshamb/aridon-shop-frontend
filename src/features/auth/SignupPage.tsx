import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import api from "../Api";


interface SignupForm {
    name: string;
    email: string;
    password: string;
}

export default function SignupPage() {
    const {register, handleSubmit} = useForm<SignupForm>();
    const navigate = useNavigate();
    
    const onSubmit = async (data: SignupForm) => {
        try {
            const response = await api.post("/account/register", data);
            localStorage.setItem("token", response.data.token);
            navigate("/account");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Регистрация
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Имя пользователя"
                    autoComplete="name"
                    autoFocus
                    {...register("name")}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Эл. адрес"
                    autoComplete="email"
                    autoFocus
                    {...register("email")}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register("password")}
                />
                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                    Зарегистрироваться
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="/aridon-shop-frontend/Login" variant="body2" sx={{ml:14,mr:12}}>
                            {"Уже есть аккаунт? Войти"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}