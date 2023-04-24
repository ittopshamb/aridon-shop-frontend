import React, { useState, useEffect } from "react";
import {Button, List, ListItem, ListItemText, Pagination, Stack, styled} from "@mui/material";
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
    const token = localStorage.getItem("token");

    const perPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(
                `http://localhost:7079/products/get_by_category?categoryId=${categoryId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
            const data = await response.json();
            setProducts(data.products);
            setPageCount(Math.ceil(data.products.length / perPage));
        };
        fetchProducts();
    }, [categoryId]);

    const handledRemoveProduct = async (productId: string,event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await fetch(`http://localhost:7079/products/delete_by_id?id=${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        setProducts(prevProducts => prevProducts.filter(product => product.productId !== productId));
    };
        
    
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    const offset = currentPage * perPage;

    const currentProducts = products
        .slice(offset, offset + perPage)
        .map((product) => (
            <Link key={product.productId} to={`/product/${product.productId}`}>
                <ListItem>
                    <img src={product.image} alt={product.productName} style={{ width: 80, height: 80, marginRight: 16 }} />
                    <ListItemText primary={product.productName} secondary={`$${product.price}`} />
                    <RemoveButton onClick={event => handledRemoveProduct(product.productId,event)}>
                        Remove
                    </RemoveButton>
                    <Link key={product.productId} to={`/ProductUpdate/${product.productId}`}>
                        <Button>Edit</Button>
                    </Link>
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
const RemoveButton = styled(Button)({
    color: "#f44336",
    "&:hover": {
        backgroundColor: "#f44336",
        color: "#fff"
    }});
export default ProductsPage;