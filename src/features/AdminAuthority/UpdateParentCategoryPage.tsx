import React, {useEffect, useState, useCallback,} from "react";
import {
    Button,
    ListItem,
    TextField,
    Typography,
} from "@mui/material";
import {useParams} from "react-router-dom";
import api from "../Api";

type ParentCategory = {
    categoryId: string;
    categoryName: string;
}

export default function UpdateParentCategoryPage(): JSX.Element {
    const {parentCategoryId} = useParams<{ parentCategoryId: string }>();
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const [parentCategory,setParentCategory] = useState<ParentCategory>({
        categoryId:"",
        categoryName:"",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Cannot get user authorization token!");
            return;
        }
        setHeaders({Authorization: `Bearer ${token}`});
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (!headers) return;
            const userResponse = await api.get(`/account/get_current`, {
                headers,
            });
            const isAdmin = !!userResponse.data?.roles?.includes('Admin')
            setIsAdmin(isAdmin);
            if (!isAdmin) return;
        }

        fetchData();
    }, [headers]);

    useEffect(()=>{
        async function fetchData(){
            try{
                const parentResponse = await api.get(`/parentCategories/get_by_id?id=${parentCategoryId}`);
                console.log(parentResponse.data);
                setParentCategory({
                    categoryName: parentResponse.data.categoryName,
                    categoryId: parentResponse.data.categoryId
                });
            } catch{
                alert("Cannot get Parent-Category, please refresh page!");
            }
        }
        fetchData();
    },[]);

    const handleSubmit = useCallback(async ()=>{
        try{
            await api.put(`/parentCategories/update?id=${parentCategoryId}&newName=${parentCategory.categoryName}&CategoryId=${parentCategory.categoryId}`,{parentCategory},
                {
                    headers
                });
            alert("Changed");
        } catch  {
            alert("Error while creating product!");
        }
    },[parentCategoryId, headers]);

    const createValueChangeHandler = useCallback((key: keyof ParentCategory) => {
        return function (event: React.ChangeEvent<HTMLInputElement>) {
            let value: string | number = event.target.value;
            setParentCategory(el => ({...el, [key]: value}));
        }
    }, [parentCategoryId]);
    
    
    if (isAdmin === undefined || parentCategory === undefined) return <div>Loading...</div>;
    if (!isAdmin) return <div>Only admin is allowed to add products!</div>;
    return (<form>
        <Typography variant="h4" gutterBottom>
            Edit Parent-Category
        </Typography>
        <ListItem>
            <TextField required id="outlined-basic" label="Name" variant="outlined" value={parentCategory.categoryName}
                       onChange={createValueChangeHandler('categoryName')}/>
        </ListItem>
        <Button onClick={handleSubmit} variant="contained" size="large" sx={{mt: 3}}>
            Change
        </Button>
    </form>);
}