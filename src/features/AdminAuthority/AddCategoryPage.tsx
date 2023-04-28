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
    categoryId: string,
    categoryName: string,
}

type Subcategory = {
    name: string,
    parentCategoryId: string
}

export default function AddCategoryPage(): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>()
    const [subcategory, setSubcategory] = useState<Subcategory>({
        name: "",
        parentCategoryId: ""
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

            try {
                const categoriesResponse = await api.get("/parentCategories/get_all", {headers});
                const categories = categoriesResponse.data.parentCategories;
                setCategories(categories);
            } catch {
                alert("невозможно получить род. категории. Обновите страницу!")
            }
        }

        fetchData();
    }, [headers]);

    const createValueChangeHandler = useCallback((key: keyof Subcategory, shouldParseFloat = false) => {
        return function (event: React.ChangeEvent<HTMLInputElement>) {
            let value: string | number = event.target.value;
            if (shouldParseFloat) {
                value = parseFloat(value);
                if (isNaN(value)) return;
            }

            setSubcategory(subcategory => ({...subcategory, [key]: value}));
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            await api.post(`/categories/add?ParentId=${subcategory.parentCategoryId}&Name=${subcategory.name}`, null, {headers});
            alert("Добавлено");
            navigate('/Categories');
        } catch {
            alert("Ошибка при добавлении категории!");
        }
    }, [subcategory, headers])

    if (isAdmin === undefined || categories === undefined) return <div>Loading...</div>;
    if (!isAdmin) return <div>Only admin is allowed to add products!</div>;
    return (
        <form>
            <Typography variant="h4" gutterBottom>
                Добавление категории
            </Typography>
            <ListItem>
                <TextField sx={{width: '100%'}} required id="outlined-basic" label="Name" variant="outlined"
                           value={subcategory.name} onChange={createValueChangeHandler('name')}/>
            </ListItem>
            <ListItem>
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={subcategory.parentCategoryId}
                        label="Select Category"
                        onChange={event => setSubcategory(subcategory => ({...subcategory, parentCategoryId: event.target.value}))}
                    >
                        {categories.map(category => <MenuItem key={category.categoryId}
                                                              value={category.categoryId}>{category.categoryName}</MenuItem>)}
                    </Select>
                </FormControl>
            </ListItem>
            <ListItem>
                <Button onClick={handleSubmit} variant="contained" size="large" sx={{mt: 3, ml: 12}}>
                    Добавить
                </Button>
            </ListItem>

        </form>
    );
}