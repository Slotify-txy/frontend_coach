import React from 'react';
import { green, red } from '@mui/material/colors';
import { closeSnackbar } from 'notistack';
import { Button } from '@mui/material';

export const deleteConfirmationAction = (callback) => (snackbarId) => (
  <>
    <Button
      onClick={() => {
        callback();
        closeSnackbar(snackbarId);
      }}
      sx={{ color: green['A400'], p: 0, fontWeight: 'bold' }}
    >
      Yes
    </Button>

    <Button
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
      sx={{ color: red['A400'], p: 0, fontWeight: 'bold' }}
    >
      No
    </Button>
  </>
);
