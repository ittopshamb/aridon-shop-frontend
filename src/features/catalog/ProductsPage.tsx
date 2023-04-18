import React, { useState, useEffect } from "react";
import {List, ListItem, ListItemText, Pagination, Stack, styled} from "@mui/material";
import {Link, useParams} from 'react-router-dom';

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
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const perPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(
                `http://localhost:7079/products/get_by_category?categoryId=${categoryId}`
            );
            const data = await response.json();
            setProducts(data.products);
            setPageCount(Math.ceil(data.products.length / perPage));
        };
        fetchProducts();
    }, [categoryId]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    const offset = currentPage * perPage;

    const currentProducts = products
        .slice(offset, offset + perPage)
        .map((product) => (
            <Link to={`/product/${product.productId}`}>
                <ListItem key={product.productId}>
                    <img src={product.image} alt={product.productName} style={{ width: 80, height: 80, marginRight: 16 }} />
                    <ListItemText primary={product.productName} secondary={`$${product.price}`} />
                </ListItem>
            </Link>
        ));

    return (
        <div>
            <List>{currentProducts}</List>
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