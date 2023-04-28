import React, {useEffect, useState, useCallback,} from "react";
import {
    Button,
    FormControl,
    InputLabel,
    ListItem,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import api from "../Api";
import {useNavigate} from "react-router-dom";

type Category = {
    categoryId:string;
    categoryName: string;
}

export default function AddParentCategoryPage(): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>({
        categoryId: "",
        categoryName: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Невозможно получить токен авторизации пользователя!");
            return;
        }
        setHeaders({Authorization: `Bearer ${token}`});
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (!headers) return;

            const userResponse = await api.get("/account/get_current", {
                headers,
            });

            const isAdmin = !!userResponse.data?.roles?.includes('Admin')
            setIsAdmin(isAdmin);
            if (!isAdmin) return;
        }

        fetchData();
    }, [headers]);

    const createValueChangeHandler = useCallback((key: keyof Category, shouldParseFloat = false) => {
        return function (event: React.ChangeEvent<HTMLInputElement>) {
            let value: string | number = event.target.value;
            if (shouldParseFloat) {
                value = parseFloat(value);
                if (isNaN(value)) return;
            }

            setCategory(category => ({...category, [key]: value}));
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            await api.post(`/parentCategories/add?Name=${category.categoryName}`, null, {headers});
            alert("Добавлено");
            navigate('/Categories');
        } catch {
            alert("Ошибка при добавлении род. категории!");
        }
    }, [category, headers])

    if (isAdmin === undefined) return <div>Loading...</div>;
    if (!isAdmin) return <div>Only admin is allowed to add products!</div>;
    return (
        <form>
            <Typography variant="h4" gutterBottom>
                Добавление род. категории
            </Typography>
            <ListItem>
                <TextField sx={{width: '100%'}} required id="outlined-basic" label="Name" variant="outlined"
                           value={category.categoryName} onChange={createValueChangeHandler('categoryName')}/>
            </ListItem>
            <ListItem>
                <Button onClick={handleSubmit} variant="contained" size="large" sx={{mt: 3, ml: 17}}>
                    Добавить
                </Button>
            </ListItem>

        </form>
    );
}