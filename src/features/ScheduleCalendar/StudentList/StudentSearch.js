import { InputAdornment, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  searchStudents,
  selectAvailableStudents,
  setIsSearching,
} from '../../common/studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import PeopleIcon from '@mui/icons-material/People';

export default function StudentSearch() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(searchStudents(searchText));
  }, [searchText]);

  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder="Search students"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PeopleIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
