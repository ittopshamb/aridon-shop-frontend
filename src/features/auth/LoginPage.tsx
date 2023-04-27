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


interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const {register, handleSubmit} = useForm<LoginForm>();
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/account");
        }
    }, [navigate]);

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await api.post("/account/authentication", data);
            localStorage.setItem("token", response.data.token);
            navigate("/account");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Вход
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
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
                    Войти
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="/aridon-shop-frontend/SignUp" variant="body2" sx={{ml:12,mr:12}}>
                            {"Нет аккаунта? Регистрация"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}