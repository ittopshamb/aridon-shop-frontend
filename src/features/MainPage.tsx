import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    List,
    ListItem,
    ListItemText,
    Pagination,
    Stack,
    styled, Typography
} from "@mui/material";
import { Link } from 'react-router-dom';
import api from "./Api";

type Product = {
    productId: string;
    productName: string;
    price: number;
    image: string;
    description: string;
    categoryId: string;
};

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const perPage = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await api.get("/products/get_all");
            const data = await response.data;
            setProducts(data.products);
            setPageCount(Math.ceil(data.products.length / perPage));
        };
        fetchProducts();
    }, []);

    const getPaginatedItems = (): Product[] => {
        const startIndex = currentPage * perPage;
        const endIndex = startIndex + perPage;
        return products.slice(startIndex, endIndex);
    };
    
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    return (
        <Container sx={{display:'flex', flexWrap:'wrap', justifyContent:'center',maxWidth: '800px'}}>
            {getPaginatedItems().map(product => {
                if (product) {
                    return (
                        <Link key={product.productId} to={`/product/${product.productId}`}>
                            <Card key={product.productId} sx={{ maxWidth: '200px',maxHeight:'386px', margin: '20px' }}>
                                <CardMedia component="img" height="200" image={product.image} alt={product.productName} />
                                <CardContent sx={{width:'200px',height:'400px'}}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.productName}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ marginTop: '1rem' }}>
                                        Price: ${product.price}
                                    </Typography>
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
                    <StyledStack sx={{ marginRight: '215px'}} spacing={2}>
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

export default ProductsPage;