import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { logout } from '../../features/auth/authSlice';

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Fragment>
      <IconButton onClick={handleClick}>
        <Avatar alt={user?.name} src={user?.picture} />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl}>
        <IconButton
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              width: 300,
              py: 3,
              px: 5,
              backgroundColor: '#e9eef6',
              borderRadius: 8,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{
                    mb: 2,
                    color: '#1F1F1F',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
              <Avatar
                alt={user?.name}
                src={user?.picture}
                sx={{ mb: 1, width: 80, height: 80 }}
              />
              <Typography sx={{ fontSize: 22, fontWeight: 400, mb: 2 }}>
                Hi, {user?.name}!
              </Typography>
              <Button
                startIcon={<LogoutIcon />}
                sx={{
                  width: '90%',
                  borderRadius: 4,
                  color: '#202224',
                  backgroundColor: '#F8FAFD',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#e7e8ec',
                    boxShadow: 'none',
                  },
                }}
                onClick={handleLogout}
              >
                <Typography
                  sx={{ fontSize: 14, color: '#1F1F1F', fontWeight: 500 }}
                >
                  Sign out
                </Typography>
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Fragment>
  );
};
