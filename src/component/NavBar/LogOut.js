import { Box, IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react'
import { blue } from '@mui/material/colors';

const LogOut = () => {
    return (
        <IconButton sx={{ color: blue[300], }} onClick={() => console.log("log out")}>
            <LogoutIcon sx={{ fontSize: 20 }} />
        </IconButton>
    )
}

export default LogOut