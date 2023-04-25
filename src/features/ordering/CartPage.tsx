import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button, styled, Stack, Pagination, List, ListItem
} from '@mui/material';
import api from "../Api";
import {Link, useNavigate} from "react-router-dom";

type CartItem = {
    id: string;
    productId: string;
    quantity: number;
};

type Product = {
    productId: string;
    productName: string;
    price: number;
    image: string;
    description: string;
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const perPage = 10;


    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            alert("You do not have a shopping cart, log in.");
            return  navigate("/login");
        }

    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const response = await api.get('/cart/get',{ headers:
                    { Authorization: `Bearer ${token}` }
                    }
               );
            const data = await response.data;
            setCartItems(data.items);
        };
        fetchCart();
    }, [token]);

    useEffect(() => {
        const fetchProducts = async () => {
            const ids = cartItems.map(item => item.productId);
            const response = await Promise.all(
                ids.map(id => api.get(`/products/get_by_id?id=${id}`))
            );
            const data = await Promise.all(response.map(res => res.data));
            setProducts(data);
            setPageCount(Math.ceil(data.length / perPage));
        };
        if (cartItems.length > 0) {
            fetchProducts();
        }
    }, [cartItems]);

    const handleRemoveFromCart = async (id: string) => {
        const response = await api.delete(`/cart/delete_item?id=${id}&quantity=1`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
         await response.data;
        const updatedItems = cartItems.map(item => {
            if (item.id === id && item.quantity > 50) {
                return { ...item, quantity: item.quantity - 10 };
            } if (item.id === id && item.quantity < 50) {
                return { ...item, quantity: item.quantity - 1 };
            }
            else {
                return item;
            }
        }).filter(item => item.quantity > 0);
        setCartItems(updatedItems);
    };

    const getTotalPrice = (): number => {
        let total = 0;
        if (Array.isArray(cartItems)) {
            cartItems.forEach(item => {
                const product = products.find(p => p.productId === item.productId);
                if (product) {
                    total += product.price * item.quantity;
                }
            });
        }
        return total;
    };
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    const getPaginatedItems = (): Product[] => {
        const startIndex = currentPage * perPage;
        const endIndex = startIndex + perPage;
        return products.slice(startIndex, endIndex);
    };

    return (
        <Container sx={{display:'flex', flexWrap:'wrap', justifyContent:'center'}} maxWidth="sm">
            {getPaginatedItems().map(product => {
                const item = cartItems.find(item => item.productId === product.productId);
                if (item) {
                    return (
                        <Link key={product.productId} to={`/product/${product.productId}`}>
                            <Card key={product.productId} sx={{ maxWidth: '200px',maxHeight:'386px', margin: '20px' }}>
                                <CardMedia component="img" height="200" image={product.image} alt={product.productName} />
                                <CardContent sx={{width:'200px',height:'400px'}}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Quantity: {item.quantity}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ marginTop: '1rem' }}>
                                        Price: ${product.price * item.quantity}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ marginTop: '1rem' }}
                                        onClick={() => handleRemoveFromCart(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                } else {
                    return null;
                }
            })}
            <List sx={{display:'flex', flexWrap:'wrap', justifyContent:'center',marginLeft: '190px'}}>

                <ListItem>
                    <Box >
                        <Typography variant="h6" color="text.secondary" sx={{ marginTop: '1rem' }}>
                            Total Price: ${getTotalPrice()}
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem>
                    <Button variant="contained" sx={{ marginTop: '20px', height: '40px' ,marginLeft:'35px'}}>
                        Buy
                    </Button>
                </ListItem>
                <ListItem>
                    <StyledStack sx={{ marginLeft: '-15px'}} spacing={2}>
                        <Pagination
                            count={pageCount}
                            variant="outlined"
                            shape="rounded"
                            page={currentPage + 1}
                            onChange={handlePageChange}
                        />
                    </StyledStack>
                </ListItem>
            </List>
        </Container>
    );
};
const StyledStack = styled(Stack)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "16px",
});

export default CartPage;
