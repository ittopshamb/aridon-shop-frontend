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
    const token = localStorage.getItem("token");
    const perPage = 10;

    useEffect(() => {
        const fetchCart = async () => {
            const response = await fetch('http://localhost:7079/cart/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setCartItems(data.items);
            console.log(data.items);
        };
        fetchCart();
    }, [token]);

    useEffect(() => {
        const fetchProducts = async () => {
            const ids = cartItems.map(item => item.productId);
            const response = await Promise.all(
                ids.map(id => fetch(`http://localhost:7079/products/get_by_id?id=${id}`))
            );
            const data = await Promise.all(response.map(res => res.json()));
            setProducts(data);
            setPageCount(Math.ceil(data.length / perPage));
        };
        if (cartItems.length > 0) {
            fetchProducts();
        }
    }, [cartItems]);

    const handleRemoveFromCart = async (id: string) => {
        const response = await fetch(`http://localhost:7079/cart/delete_item?id=${id}&quantity=1`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.json();

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
                        <Card key={product.productId} sx={{ maxWidth: 500, margin: '5px' }}>
                            <CardMedia component="img" height="200" image={product.image} alt={product.productName} />
                            <CardContent>
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
                    <StyledStack sx={{ marginLeft: '30px'}} spacing={2}>
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