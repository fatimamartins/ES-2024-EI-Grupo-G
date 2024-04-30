// Importing files from Material-UI
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@mui/material/useMediaQuery'

import { List, ListItem, ListItemText, Collapse } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

// Using Inline Styling
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}))

// Exporting Default Navbar to the App.js File
export default function Navbar() {
    const classes = useStyles()
    const small = useMediaQuery('(max-width:600px)')
    const full = useMediaQuery('(min-width:600px)')

    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    {small && (
                        <>
                            <List>
                                <ListItem button>
                                    <Button onClick={handleClick}>
                                        <MenuIcon />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </Button>
                                    <Typography
                                        variant="h6"
                                        color="inherit"
                                        onClick={() => {
                                            console.log('logo clicked')
                                            setOpen(false)
                                        }}
                                    >
                                        Gestão de Horários
                                    </Typography>
                                </ListItem>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem button>
                                            <ListItemText primary="Horário e Salas" />
                                        </ListItem>
                                        <ListItem button>
                                            <ListItemText primary="Network Graph" />
                                        </ListItem>{' '}
                                        <ListItem button>
                                            <ListItemText primary="Heatmap" />
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </List>
                        </>
                    )}

                    {full && (
                        <>
                            <Typography variant="h6" color="inherit">
                                Gestão de Horários
                            </Typography>
                            <Button color="inherit">Horário e Salas</Button>

                            <Button color="inherit">Network Graph</Button>
                            <Button color="inherit">Heatmap</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    )
}
