﻿import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";

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
    
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch("http://localhost:7079/parentCategories/get_all");
            const data = await response.json();
            setCategories(data.parentCategories);
        };
        fetchCategories();
    }, []);

    const handleClick = async (categoryId: string) => {
        const response = await fetch(`http://localhost:7079/categories/get_by_parent_id?parentId=${categoryId}`);
        const data = await response.json();
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
    
    return (
        <div>
            <List>
                {categories.map((category) => (
                    <React.Fragment key={category.categoryId}>
                        <ListItem button onClick={() => handleClick(category.categoryId)}>
                            <ListItemText primary={category.categoryName} />
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
                                        <ListItem button key={subcategory.categoryId}>
                                            <Link style={{color: "black", margin:"10px"}} to={`/products/${subcategory.categoryId}`} ><ListItemText primary={subcategory.categoryName} /> </Link>
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

export default CategoriesPage;