/**
 * @file Navbar.js
 * This file contains the Navbar component which is the navigation bar of the application.
 */

/** @module react */
import * as React from 'react'
/** @module @mui/material/AppBar */
import AppBar from '@mui/material/AppBar'
/** @module @mui/material/Box */
import Box from '@mui/material/Box'
/** @module @mui/material/Toolbar */
import Toolbar from '@mui/material/Toolbar'
/** @module @mui/material/IconButton */
import IconButton from '@mui/material/IconButton'
/** @module @mui/material/Typography */
import Typography from '@mui/material/Typography'
/** @module @mui/material/Menu */
import Menu from '@mui/material/Menu'
/** @module @mui/icons-material/Menu */
import MenuIcon from '@mui/icons-material/Menu'
/** @module @mui/material/Container */
import Container from '@mui/material/Container'
/** @module @mui/material/Button */
import Button from '@mui/material/Button'
/** @module @mui/material/MenuItem */
import MenuItem from '@mui/material/MenuItem'
/** @module react-router-dom */
import { Link } from 'react-router-dom'
/** @module App.css */
import './App.css'

/**
 * @description The pages array contains the names and paths of the pages in the application.
 * @constant {Object[]} pages
 */
const pages = [
    { name: 'Horário e Salas', path: '' },
    { name: 'Conflitualidade entre Aulas', path: 'Conflitualidade' },
    { name: 'Ocupação de Salas', path: 'Ocupacao' },
]

/**
 * @description This is the NavBar component of the application.
 * It manages the navigation bar at the top of the application.
 *
 * @function
 * @name NavBar
 * @returns {JSX.Element} The rendered NavBar component.
 */
function NavBar() {
    /**
     * @description The state and setter for the anchorElNav state variable.
     * @constant {null|HTMLElement} anchorElNav
     * @function setAnchorElNav
     */
    const [anchorElNav, setAnchorElNav] = React.useState(null)

    /**
     * @description Handles the opening of the navigation menu.
     * @function handleOpenNavMenu
     * @param {Event} event - The click event.
     */
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    /**
     * @description Handles the closing of the navigation menu.
     * @function handleCloseNavMenu
     */
    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    /**
     * @description Returns the JSX to render the NavBar component.
     */
    return (
        <AppBar position="static">
            <Container sx={{ maxWidth: 1250, minWidth: 1250 }}>
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
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
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link style={{ textDecoration: 'none', color: '#1976d2' }} to={`/${page.path}`}>
                                            {page.name}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link to={`/${page.path}`}>{page.name}</Link>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
/**
 * @description The default export of the NavBar module.
 */
export default NavBar
