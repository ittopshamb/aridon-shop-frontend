import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link }from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {Account} from "../../models";
import api from "../../features/Api";



const pages = ['Categories', 'Cart'];
const settings = ['Account', 'Logout'];


function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<undefined | null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<undefined | null | HTMLElement>(null);
    const [account, setAccount] = useState<Account | null>(null);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const headers = { Authorization: `Bearer ${token}` };
                const response = await api.get("/account/get_current", {
                    headers,
                });
                setAccount(response.data);
            }
        };
        fetchAccount();
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            setAccount(null);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };
    const linkStyles = { color: 'white', margin: '10px', marginRight: '30px'};
    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Link className={"link"} to="/" style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                    >
                        ARIDON
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link className={"link"} key={page} to={`/${page}`}
                                // sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Link>
                        ))}
                    </Box>
                    <Typography>
                        {account ? (
                            <Link
                                style={linkStyles} to={`/Account`}>
                                {account.email} 
                            </Link>
                        ) : (
                            <Link style={linkStyles} to={`/Login`}>
                                Login
                            </Link>
                        )}
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={setting === "Logout" ? handleLogout : handleCloseUserMenu}>
                                    <Link style={{color: "black", margin: "10px"}} key={setting} to={`/${setting}`}>
                                        {setting}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;