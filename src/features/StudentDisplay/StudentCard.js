import {
  Avatar,
  Badge,
  Box,
  Card,
  CardHeader,
  Chip,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const StudentCard = ({ student }) => {
  return (
    <Card
      sx={{
        width: '100%',
        '--Card-radius': '18px',
      }}
      variant="outlined"
    >
      <CardHeader
        sx={{ width: '100%', px: 2 }}
        avatar={
          <Avatar
            alt={student.name}
            src={student.picture}
            sx={{ bgcolor: blue[500], width: 30, height: 30 }}
            aria-label="student_card"
          />
        }
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: 13 }}>{student.name}</Typography>
          </Stack>
        }
        subheader={
          <Typography sx={{ fontSize: 13 }}>{student.email}</Typography>
        }
      />
    </Card>
  );
};

export default StudentCard;
