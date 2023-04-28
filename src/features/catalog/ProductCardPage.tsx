import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Container, Card, CardContent, Typography, Button, TextField} from '@mui/material';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../Api";

type Product = {
    productId: string;
    productName: string;
    price: number;
    image: string;
    description: string;
    categoryId: string;
};

export default function ProductCardPage(): JSX.Element {
    const {productId} = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchProduct() {
            const response = await api.get(`/products/get_by_id?id=${productId}`);
            const data = await response.data;
            setProduct(data);
        }

        fetchProduct();
    }, [productId]);


    const handleAddToCart = async () => {

        if (!token) {
            alert("Пожалуйста авторизуйтесь перед тем, как сделать покупку!");
            return navigate("/login");
        }
        const headers = {Authorization: `Bearer ${token}`}
        await api.post(`/cart/add_item?productId=${productId}&quantity=${quantity}`, {
            productId,
            quantity,
        }, {
            headers,
        });
        toast.info("Товар добавлен в корзину");
    }
    if (!product) {
        return <div>Loading product...</div>;
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Container maxWidth="sm">
                <Card sx={{maxWidth: 500, margin: "5px"}}>
                    {/*<CardMedia component="img" height="500" image={product.image} alt={product.productName}/>*/}
                    <img src={product.image} alt={product.productName} style={{width: 280, height: 400}}/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{marginTop: '1rem'}}>
                            Цена: ₽{product.price}
                        </Typography>
                        <TextField
                            label="Количество"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            inputProps={{min: 1}}
                            sx={{marginTop: '10px', width: '100px'}}
                        />
                        <Button variant="contained" sx={{marginTop: '20px', marginLeft: '10px', height: '30px'}}
                                onClick={handleAddToCart}>
                            Добавить в корзину
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};