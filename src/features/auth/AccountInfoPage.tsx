import React, { useEffect, useState } from "react";
import {Box, Card, CardContent, Typography} from "@mui/material";
import api from "../Api"
import {useNavigate} from "react-router-dom";

type Account = {
    name: string;
    email: string;
};

export default function AccountPage() {
    const [account, setAccount] = useState<Account | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const headers = { Authorization: `Bearer ${token}` };
                const response = await api.get("/account/get_current", {
                    headers,
                });
                setAccount(response.data);
            }
            else {
                navigate('/login')
            }
        };
        fetchAccount();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Информация об аккаунте
            </Typography>
            {account ? (
                <Card sx={{mb:5,mt:5}}>
                    <CardContent>
                        <img src="../../../public/user.png" alt={"user avatar"} style={{ width: 128, height: 128, position: 'relative', right:0}}/>
                        <Typography gutterBottom variant="h5" component="div" sx={{fontSize:15, left:0, position:'relative'}}>
                            {account.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {account.email}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1" gutterBottom>
                    Загрузка информации об аккаунте...
                </Typography>
            )}
        </Box>
    );
}