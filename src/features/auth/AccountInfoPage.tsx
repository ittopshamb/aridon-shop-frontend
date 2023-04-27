import { useEffect, useState } from "react";
import {Box, Typography} from "@mui/material";
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
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Имя: {account.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Почта: {account.email}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="body1" gutterBottom>
                    Загрузка информации об аккаунте...
                </Typography>
            )}
        </Box>
    );
}