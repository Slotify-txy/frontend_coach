import React, { useEffect, useState } from 'react';

import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import { useLoginMutation } from '../app/services/authApiSlice';

export function RedirectPage() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.slice(1));
    const idToken = urlParams.get('id_token');

    const promise = login(idToken);
    promise
      .then(() => navigate('/schedule', { replace: true }))
      .catch(() =>
        enqueueSnackbar('Failed to log in.', {
          variant: 'error',
        })
      );

    // In react 18's dev mode, use effect will be triggered twice, so the first request needs to be aborted when unmounting
    return () => {
      promise.abort();
    };
  }, []);

  return (
    <Box sx={{ height: '100vh' }}>
      <LoadingSpinner />
    </Box>
  );
}

export default RedirectPage;
