import { Avatar, Box, IconButton } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';

export const Profile = () => {
  const size = 30;
  return (
    <Box>
      <IconButton onClick={() => console.log('profile')}>
        <Avatar
          sx={{ bgcolor: blue[300], width: size, height: size }}
          alt="Xiyuan"
          src="/broken-image.jpg"
        />
      </IconButton>
    </Box>
  );
};
