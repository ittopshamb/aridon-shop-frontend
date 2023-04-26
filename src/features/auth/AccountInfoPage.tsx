import { useEffect, useState } from "react";
import {Box, Typography} from "@mui/material";
import api from "../Api"

type Account = {
    name: string;
    email: string;
};

export default function AccountPage() {
    const [account, setAccount] = useState<Account | null>(null);

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
        };
        fetchAccount();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Account Information
            </Typography>
            {account ? (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Name: {account.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Email: {account.email}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="body1" gutterBottom>
                    Loading account information...
                </Typography>
            )}
        </Box>
    );
}