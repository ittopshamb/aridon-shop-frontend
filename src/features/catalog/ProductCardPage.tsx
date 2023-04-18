﻿import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Container, Card, CardContent, CardMedia, Typography, Button, TextField} from '@mui/material';
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7079",
});

type Product = {
    productId: string;
    productName: string;
    price: number;
    image: string;
    description: string;
    categoryId: string;
};

const ProductCardPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    if (!token) {
        navigate("/login");
        return;
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`http://localhost:7079/products/get_by_id?id=${productId}`);
            const data = await response.json();
            setProduct(data);
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        try {
            const response = await api.post(`/cart/add_item?productId=${productId}&quantity=${quantity}`, {
                productId,
                quantity,
            }, {
                headers,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) {
        return <div>Loading product...</div>;
    }

    return (
        <Container maxWidth="sm">
            <Card sx={{ maxWidth: 500,margin: "5px" }}>
                <CardMedia component="img" height="500" image={product.image} alt={product.productName} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.description}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ marginTop: '1rem' }}>
                        Price: ${product.price}
                    </Typography>
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ marginTop: '10px', width: '100px'}}
                    />
                    <Button variant="contained" sx={{ marginTop: '20px', marginLeft: '10px', height: '30px' }} onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProductCardPage;