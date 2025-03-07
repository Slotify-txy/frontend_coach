import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
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
import { ActionBar } from './ActionBar';
import AvailableStudentList from './AvailableStudentList';
import ArrangingStudentList from './ArrangingStudentList';
import StudentSearch from './StudentSearch';
import AUTH_STATUS from '../../../common/constants/authStatus';
import { useSelector } from 'react-redux';
import { useGetAvailableStudentsQuery } from '../../../app/services/studentApiSlice';
import LoadingSpinner from '../../../components/LoadingSpinner';

const StudentList = ({
  droppedStudent,
  setDroppedStudent,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const height = 50;
  const { user, status } = useSelector((state) => state.auth);

  const { isFetching } = useGetAvailableStudentsQuery(
    { coachId: user?.id },
    {
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );

  return (
    <Box sx={{ height: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ height, px: 1 }}>
        <Box sx={{ width: '50%' }}>
          <StudentSearch />
        </Box>
        {/* hide arrangingStudentList for now */}
        <Box sx={{ width: '50%' }}>
          <ActionBar />
        </Box>
      </Stack>
      <Stack direction="row" sx={{ height: `calc(100% - ${height}px)` }}>
        {isFetching ? (
          <LoadingSpinner />
        ) : (
          <>
            <Stack
              direction="column"
              sx={{
                height: '100%',
                width: '50%',
              }}
              spacing={1}
            >
              <Typography fontSize={15} sx={{ pl: 1 }}>
                Students Requesting Class
              </Typography>
              <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <AvailableStudentList
                  droppedStudent={droppedStudent}
                  setDroppedStudent={setDroppedStudent}
                  draggedStudent={draggedStudent}
                  setDraggedStudent={setDraggedStudent}
                  selectedStudent={selectedStudent}
                  setSelectedStudent={setSelectedStudent}
                />
              </Box>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack
              direction="column"
              sx={{
                height: '100%',
                width: '50%',
              }}
              spacing={1}
            >
              <Typography fontSize={15} sx={{ pl: 1 }}>
                Students for Scheduling
              </Typography>
              <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <ArrangingStudentList
                  droppedStudent={droppedStudent}
                  setDroppedStudent={setDroppedStudent}
                  draggedStudent={draggedStudent}
                  setDraggedStudent={setDraggedStudent}
                  selectedStudent={selectedStudent}
                  setSelectedStudent={setSelectedStudent}
                />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default StudentList;
