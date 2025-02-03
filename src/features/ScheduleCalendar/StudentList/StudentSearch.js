import { InputAdornment, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  searchStudents,
  selectSchedulingStudents,
  setIsSearching,
} from './studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import PeopleIcon from '@mui/icons-material/People';

export default function StudentSearch() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const schedulingStudents = useSelector(selectSchedulingStudents);

  useEffect(() => {
    dispatch(setIsSearching(searchText !== ''));
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
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PeopleIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
