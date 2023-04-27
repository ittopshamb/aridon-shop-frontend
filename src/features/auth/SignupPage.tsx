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
    surname: string;
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
                Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="User Name"
                    autoComplete="name"
                    autoFocus
                    {...register("name")}
                />
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
                    Sign up
                </Button>
                <Grid container>
                    <Grid item>
                        <Link href="/Login" variant="body2" >
                            {"Already have an account? Sign in"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}