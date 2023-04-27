import React, { useState, useEffect } from "react";
import {Button, List, ListItem, ListItemText, Pagination, Stack, styled} from "@mui/material";
import {Link, useParams} from 'react-router-dom';
import api from "../Api";

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
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const [isAdmin,setIsAdmin] = useState(false);
    const perPage = 10;


    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            alert("Cannot get user authorization token!");
            return;
        }
        setHeaders({ Authorization: `Bearer ${token}` });
    }, []);
    
    
    
    useEffect(() => {
        async function fetchData() {
            if(!headers) return;
            const userResponse = await api.get("/account/get_current", {
                headers
            });
            const isAdmin = !!userResponse.data?.roles?.includes('Admin')
            setIsAdmin(isAdmin);
            if(!isAdmin) return null;
        }
        fetchData();
    }, [headers]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await api.get(`/products/get_by_category?categoryId=${categoryId}`, {
                headers
            });
            const data = await response.data;
            setProducts(data.products);
            setPageCount(Math.ceil(data.products.length / perPage));
        };
        fetchProducts();
    }, [categoryId]);
    
    const handledRemoveProduct = async (productId: string,event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await api.delete(`/products/delete_by_id?id=${productId}`, {
            headers
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
                    <ListItemText primary={product.productName} secondary={`₽${product.price}`} />
                    {isAdmin && (
                        <Link key={product.productId} to={`/ProductUpdate/${product.productId}`}>
                            <Button>Edit</Button>
                            {isAdmin &&(<RemoveButton onClick={event => handledRemoveProduct(product.productId,event)}>
                                Remove
                            </RemoveButton>)}
                        </Link>)}
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