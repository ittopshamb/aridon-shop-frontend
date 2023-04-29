import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    Button, styled, Stack, Pagination, List, ListItem, Modal, TextField
} from '@mui/material';
import api from "../Api";
import { Link, useNavigate } from "react-router-dom";


type CartItem = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
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
    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [isOrdered, setIsOrdered] = useState<boolean>(false);
    const [city, setCity] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const perPage = 4;
    const [paginate, setPaginate] = useState(false);

    useEffect(() => {
        if(!token) {
            alert("Пожалуйста авторизуйтесь, чтобы увидеть корзину!");
            navigate("/login");
        }
        else {
            const fetchCart = async () => {
                const response = await api.get('/cart/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.data;
                setCartItems(data.items);
                setIsOrdering(false);
                setIsOrdered(false);
            };
            fetchCart();
        }
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
            setPaginate(true);
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
        navigate('/Cart');
    };

    const getTotalPrice = (): number => {
        let total = 0;
        if (Array.isArray(cartItems)) {
            cartItems.forEach(item => {
                const product = products.find(p => p.productId === item.productId);
                if (product) {
                    total += product.price * item.quantity;
                    item.price = product.price;
                }
            });
        }
        return total;
    };

    const handlePlaceOrder = async () => {
        await api.post(`/orders/place_order`, {
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            city: city,
            address: address,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setIsOrdering(false);
        setIsOrdered(true);
    };
    
    const HandleCloseModal = () => {
        navigate('/');
    }

    const handleBuyClick = () => {
        setIsOrdering(true);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };
    
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    const getPaginatedItems = (): Product[] => {
        const startIndex = currentPage * perPage;
        const endIndex = startIndex + perPage;
        return products.slice(startIndex, endIndex);
    };

    return (<>
            <Typography variant="h4" gutterBottom sx={{mt:2}}>
                Корзина
            </Typography>
            <Modal style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }} open={isOrdering} onClose={() => setIsOrdering(false)}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box sx={{
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 2,
                    width: 400,
                    borderRadius: '10px',
                    borderColor: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <form>
                        <ListItem>
                            <TextField required id="outlined-basic" label="Город" variant="outlined" value={city}
                                       onChange={handleCityChange}/>
                        </ListItem>
                        <ListItem>
                            <TextField required id="outlined-basic" label="Адрес" variant="outlined"
                                       value={address} onChange={handleAddressChange}/>
                        </ListItem>
                        <Button onClick={handlePlaceOrder} variant="contained" size="large" sx={{mt: 3, ml: 5}}>
                            Подтвердить
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Modal style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }} open={isOrdered} onClose={() => setIsOrdered(false)}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box sx={{
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 2,
                    width: 400,
                    borderRadius: '10px',
                    borderColor: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <form>
                        <Typography variant="h4" gutterBottom>
                            Заказ оформлен.
                        </Typography>
                        <Button onClick={HandleCloseModal} variant="contained" size="large" sx={{mt: 3, ml: 10}}>
                            Закрыть
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Container sx={{display:'flex', flexWrap:'wrap', justifyContent:'center'}} maxWidth="sm">
                {getPaginatedItems().map(product => {
                    const item = cartItems.find(item => item.productId === product.productId);
                    if (item) {
                        return (
                            <Link key={product.productId} to={`/product/${product.productId}`}>
                                <Card key={product.productId} sx={{ maxWidth: '200px',maxHeight:'450px', margin: '20px' }}>
                                    <img src={product.image} alt={product.productName} style={{ width: 140, height: 200, paddingTop:5}}/>
                                    <CardContent sx={{width:'200px',height:'450px'}}>
                                        <Typography gutterBottom variant="h5" component="div" sx={{fontSize:15}}>
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Кол-во: {item.quantity}
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary" sx={{ marginTop: '1rem' }}>
                                            Цена: ₽{product.price * item.quantity}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{ marginTop: '1rem' }}
                                            onClick={() => handleRemoveFromCart(item.id)}
                                        >
                                            Удалить
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
                            <Typography variant="h6" color="text.secondary" sx={{ marginTop: '1rem',marginLeft:'-35px' }}>
                                Общая стоимость: ₽{getTotalPrice()}
                            </Typography>
                        </Box>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" sx={{ marginTop: '20px', height: '40px' ,marginLeft:'25px'}} onClick={handleBuyClick}>
                            Купить
                        </Button>
                    </ListItem>
                    {paginate && (
                        <ListItem>
                            <StyledStack sx={{ml:'12px'}} spacing={2}>
                                <Pagination
                                    count={pageCount}
                                    variant="outlined"
                                    shape="rounded"
                                    page={currentPage + 1}
                                    onChange={handlePageChange}
                                />
                            </StyledStack>
                        </ListItem>
                    )}
                </List>
            </Container>
        </>
    );
};
const StyledStack = styled(Stack)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "16px",
});

export default CartPage;
