import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Stack } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import ActionButton from '../../../components/ActionButton';
import {
  addAllArrangingStudentsToAvailableStudents,
  addAllAvailableStudentsToArrangingStudents,
} from '../../common/studentSlice';

export const ActionBar = () => {
  const offset = [0, -70];
  const dispatch = useDispatch();

  const addAllStudents = useCallback(() => {
    dispatch(addAllAvailableStudentsToArrangingStudents());
  }, []);

  const removeAllStudents = useCallback(() => {
    dispatch(addAllArrangingStudentsToAvailableStudents());
  }, []);

  return (
    <Stack direction={'row'} sx={{ height: '100%' }}>
      <ActionButton
        color={green[700]}
        icon={<AddIcon />}
        tooltip={'Add all students to the schedule list'}
        callback={addAllStudents}
        disabled={false}
        offset={offset}
      />
      <ActionButton
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Remove all students from the schedule list'}
        callback={removeAllStudents}
        disabled={false}
        offset={offset}
      />
    </Stack>
  );
};
