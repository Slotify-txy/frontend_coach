import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
