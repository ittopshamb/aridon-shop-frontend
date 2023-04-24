import React, { useState, useEffect } from "react";
import {List, ListItem, ListItemText, Pagination, Stack, styled} from "@mui/material";
import { Link } from 'react-router-dom';

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

    const perPage = 10;
    
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch("http://localhost:7079/products/get_all");
            const data = await response.json();
            setProducts(data.products);
            setPageCount(Math.ceil(data.products.length / perPage));
        };
        fetchProducts();
    }, []);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    const offset = currentPage * perPage;

    const currentProducts = products
        .slice(offset, offset + perPage)
        .map((product) => (
            <Link style={{height:'300px',width:'200px',marginTop:'50px'}} key={product.productId} to={`/product/${product.productId}`}>
                <ListItem style={{display:'inline'}}>
                    <img src={product.image} alt={product.productName} style={{ width: 160, height: 200, marginRight: 16 }} />
                    <ListItemText primary={product.productName} secondary={`$${product.price}`} style={{textAlign:'center'}}/>
                </ListItem>
            </Link>
        ));

    return (
        <div>
            <List sx={{display:'flex',flexWrap:'wrap'}}>{currentProducts}</List>
            <StyledStack spacing={2}>
                <Pagination
                    count={pageCount}
                    variant="outlined"
                    shape="rounded"
                    page={currentPage + 1}
                    onChange={handlePageChange}
                />
            </StyledStack>
        </div>
    );
};

const StyledStack = styled(Stack)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "16px",
});

export default ProductsPage;