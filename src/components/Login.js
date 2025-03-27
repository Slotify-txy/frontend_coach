import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useSelector } from 'react-redux';
import AUTH_STATUS from '../common/constants/authStatus';

const domain = process.env.REACT_APP_COGNITO_DOMAIN; // e.g., myapp.auth.us-east-1.amazoncognito.com
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = encodeURIComponent(
  process.env.REACT_APP_LOGGIN_REDIRECT_URL
);
const responseType = 'token'; // implicit flow returns tokens in the URL hash
const scope = 'email+openid+profile';
const cognitoUrl = `${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

export default function Login() {
  const { token, status } = useSelector((state) => state.auth);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

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
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            window.location.href = cognitoUrl;
          }}
          sx={{ textTransform: 'none' }}
        >
          Sign in
        </Button>
      </DialogContent>
    </Dialog>
  );
}
