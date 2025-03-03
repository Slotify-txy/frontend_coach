import React, { useCallback } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ActionButton from './ActionButton';
import { green, red } from '@mui/material/colors';
import { closeSnackbar } from 'notistack';
import { Button, Typography } from '@mui/material';

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
