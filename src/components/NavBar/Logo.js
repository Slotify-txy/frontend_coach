import { Typography, Box } from '@mui/material';
import React from 'react';

const Logo = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <img
        src={'/calendar-svgrepo-com.png'}
        alt="calendar icon"
        style={{ width: '40px', height: '40px' }}
      />
      <Typography
        sx={{
          ml: 2,
          fontWeight: 400,
          fontSize: 25,
        }}
      >
        Slotify
      </Typography>
    </Box>
  );
};

export default Logo;
