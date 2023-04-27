import {Button, ListItem, TextField, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "../Api";


type Category = {
    categoryId:string;
    parentId:string;
    categoryName:string;
};
export default function UpdateCategoryPage(): JSX.Element{
    const {categoryId} = useParams<{ categoryId: string }>();
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const [category,setCategory] = useState<Category>({
        categoryId:"",
        parentId:"",
        categoryName:""
    });
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            alert("Cannot get user authorization token!");
            return;
        }
        setHeaders({Authorization: `Bearer ${token}`});
    },[]);

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
                const categoryResponse = await api.get(`/categories/get_by_id?id=${categoryId}`);
                console.log(categoryResponse.data);
                setCategory({
                    categoryId: categoryResponse.data.categoryId,
                    parentId: categoryResponse.data.parentId,
                    categoryName: categoryResponse.data.categoryName
                });
            } catch{
                alert("Cannot get Parent-Category, please refresh page!");
            }
        }
        fetchData();
    },[categoryId]);

    const handleSubmit = useCallback(async ()=>{
        try{
            await api.put(`/categories/update?id=${categoryId}&newName=${category.categoryName}`,{category},
                {
                    headers
                });
            alert("Changed");
        } catch  {
            alert("Error while creating product!");
        }
    },[headers]);
    
    const createValueChangeHandler = useCallback((key: keyof Category) => {
        return function (event: React.ChangeEvent<HTMLInputElement>) {
            let value: string | number = event.target.value;
            setCategory(el => ({...el, [key]: value}));
        }
    }, [categoryId]);

    if (isAdmin === undefined || category === undefined) return <div>Loading...</div>;
    if (!isAdmin) return <div>Only admin is allowed to add products!</div>;
    return (<form>
        <Typography variant="h4" gutterBottom>
            Edit Category
        </Typography>
        <ListItem>
            <TextField required id="outlined-basic" label="Name" variant="outlined" value={category.categoryName}
                       onChange={createValueChangeHandler('categoryName')}/>
        </ListItem>
        <Button onClick={handleSubmit} variant="contained" size="large" sx={{mt: 3}}>
            Change
        </Button>
    </form>);
}