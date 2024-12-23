import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';

const LogOut = () => {
  return (
    <IconButton
      sx={{ color: blue[300] }}
      onClick={() => console.log('log out')}
    >
      <LogoutIcon sx={{ fontSize: 20 }} />
    </IconButton>
  );
};

export default LogOut;
