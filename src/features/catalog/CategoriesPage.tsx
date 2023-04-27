import React, { useState, useEffect } from "react";
import {List, ListItem, ListItemText, Collapse, Button, styled} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import api from "../Api";

type Category = {
    categoryId: string;
    categoryName: string;
};

type Subcategory = {
    parentId: string;
    categoryId: string;
    categoryName: string;
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [open, setOpen] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            alert("Cannot get user authorization token!");
            return;
        }
        setHeaders({ Authorization: `Bearer ${token}` });
    }, []);
    
    useEffect(() => {
        async function fetchData() {
            if(!headers) return;
            const userResponse = await api.get("/account/get_current", {
                headers
            });
            const isAdmin = !!userResponse.data?.roles?.includes('Admin')
            setIsAdmin(isAdmin);
            if(!isAdmin) return null;
        }
        fetchData();
    }, [headers]);
    
    
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await api.get("/parentCategories/get_all");
            const data = await response.data;
            setCategories(data.parentCategories);
        };
        fetchCategories();
    }, []);

    const handleClick = async (categoryId: string) => {
        const response = await api.get(`/categories/get_by_parent_id?parentId=${categoryId}`);
        const data = await response.data;
        setSubcategories(data.categories);
        setSelectedCategory(categoryId);

        setOpen((prevOpen) => {
            return prevOpen.filter((id) => id === categoryId || !categories.find(cat => cat.categoryId === id));
        });

        setOpen((prevOpen) => {
            if (prevOpen.includes(categoryId)) {
                return prevOpen.filter((id) => id !== categoryId);
            } else {
                return [...prevOpen, categoryId];
            }
        });
    };
    const handledRemoveSubCategory = async (subCategoryId: string,event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await api.delete(`/categories/delete_by_id?id=${subCategoryId}`, {
            headers
        });
        setSubcategories(prevSubCategory => prevSubCategory.filter(e => e.categoryId !== subCategoryId));
    };
    
    const handleRemoveParentCategory = async (parentCategoryId: string , event: React.MouseEvent<HTMLButtonElement>) =>{
        event.preventDefault();
        await api.delete(`/parentCategories/delete_by_id?id=${parentCategoryId}`,{
            headers
        });
        setCategories(prevParCategory => prevParCategory.filter(e => e.categoryId !== parentCategoryId));
    }
    
    return (
        <div>
            <List>
                {categories.map((category) => (
                    <React.Fragment key={category.categoryId}>
                        <ListItem onClick={() => handleClick(category.categoryId)}>
                            <ListItemText primary={category.categoryName} />
                            {isAdmin && (
                                <Link key={category.categoryId} to={`/ParentCategoryUpdate/${category.categoryId}`}>
                                    <Button>Edit</Button>
                                </Link>)}
                            {isAdmin &&(<RemoveButton onClick={event => handleRemoveParentCategory(category.categoryId,event)}>
                                Remove
                            </RemoveButton>)}
                            {open.includes(category.categoryId) ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItem>
                        <Collapse in={open.includes(category.categoryId)} timeout="auto" unmountOnExit>
                            <List style={{paddingLeft: '15px'}} component="div" disablePadding>
                                {subcategories
                                    .filter((subcategory) => subcategory.parentId === category.categoryId)
                                    .map((subcategory) => (
                                        <ListItem key={subcategory.categoryId}>
                                            <Link style={{color: "black", margin:"10px"}} to={`/products/${subcategory.categoryId}`} ><ListItemText primary={subcategory.categoryName} /> </Link>
                                            {isAdmin && (
                                                <Link key={subcategory.categoryId} to={`/CategoryUpdate/${subcategory.categoryId}`}>
                                                    <Button>Edit</Button>
                                                </Link>)}
                                            {isAdmin &&(<RemoveButton onClick={event => handledRemoveSubCategory(subcategory.categoryId,event)}>
                                                Remove
                                            </RemoveButton>)}
                                        </ListItem>
                                    ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};
const RemoveButton = styled(Button)({
    color: "#f44336",
    "&:hover": {
        backgroundColor: "#f44336",
        color: "#fff"
    }});
export default CategoriesPage;