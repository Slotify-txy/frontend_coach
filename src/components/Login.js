import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '../app/services/authApiSlice';
import { useSelector } from 'react-redux';
import AUTH_STATUS from '../common/constants/authStatus';
import { enqueueSnackbar } from 'notistack';

export default function Login() {
  const { token, status } = useSelector((state) => state.auth);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setOpenLoginDialog(token == null);
  }, [token]);

  return (
    <Dialog open={openLoginDialog}>
      <DialogTitle>
        {status == AUTH_STATUS.TOKEN_EXPIRED
          ? 'Session expired. Please log in again!'
          : 'Tada! Welcome to Slotify!'}
      </DialogTitle>
      <DialogContent>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const { credential: token } = credentialResponse;
            try {
              await login(token).unwrap();

              // useNavigate won't refresh the page. Probably because the url is the same
              window.location.reload();
            } catch (error) {
              enqueueSnackbar('Failed to log in.', {
                variant: 'error',
              });
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
