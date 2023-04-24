import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7079",
});

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
            <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    {...register("email")}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register("password")}
                />
                <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                    Sign In
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}