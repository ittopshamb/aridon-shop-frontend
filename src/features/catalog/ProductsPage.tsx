import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import {useParams} from 'react-router-dom';
type Product = {
    productId: string;
    productName: string;
    price: number;
    image: string;
    description: string;
    categoryId: string;
};

const ProductsPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`http://localhost:7079/products/get_by_category?categoryId=${categoryId}`);
            const data = await response.json();
            setProducts(data.products);
        };
        fetchProducts();
    }, [categoryId]);

    return (
        <div>
            <List>
                {products.map((product) => (
                    <ListItem key={product.productId}>
                        <ListItemText primary={product.productName} secondary={`$${product.price}`} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ProductsPage;