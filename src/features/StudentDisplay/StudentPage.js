import {
  Avatar,
  Box,
  Checkbox,
  Container,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from '../../app/services/userApiSlice';
import AUTH_STATUS from '../../common/constants/authStatus';
import EventAction from '../../components/EventAction';
import { enqueueSnackbar } from 'notistack';
import { deleteConfirmationAction } from '../../components/DeleteConfirmationAction';
import RefreshIcon from '@mui/icons-material/Refresh';
import { selectAllStudents } from '../common/studentSlice';
import StudentCard from './StudentCard';
import { blue } from '@mui/material/colors';
import {
  useDeleteStudentsFromCoachMutation,
  useUpdateCoachMutation,
} from '../../app/services/coachApiSlice';

const StudentPage = ({ navBarHeight }) => {
  const { user } = useSelector((state) => state.auth);
  const [updateCoach, { isLoading: isUpdatingCoach }] =
    useUpdateCoachMutation();
  const [deleteStudentsFromCoach, { isLoading: isDeletingStudentFromCoach }] =
    useDeleteStudentsFromCoachMutation();
  const students = useSelector(selectAllStudents);
  const [checked, setChecked] = useState(new Set());
  const [searchText, setSearchText] = useState('');
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const handleToggle = (value) => () => {
    const newChecked = new Set([...checked]);
    if (checked.has(value)) {
      newChecked.delete(value);
    } else {
      newChecked.add(value);
    }

    setChecked(newChecked);
  };

  const generateInvitationCode = useCallback(() => {
    const newInvitationCode = Math.floor(100000 + Math.random() * 900000);
    enqueueSnackbar(`Are you sure you want to create a new invitation code?`, {
      variant: 'info',
      autoHideDuration: null,
      action: deleteConfirmationAction(async () => {
        try {
          await updateCoach({
            studentId: user?.id,
            coach: {
              ...user,
              invitationCode: newInvitationCode.toString(),
            },
          }).unwrap();
          enqueueSnackbar('New invitation code created successfully!', {
            variant: 'success',
          });
        } catch (err) {
          enqueueSnackbar(`Failed to create a new invitation code.`, {
            variant: 'error',
          });
        }
      }),
    });
  }, [user]);

  const deleteStudent = useCallback(() => {
    enqueueSnackbar(`Are you sure you want to delete the students?`, {
      variant: 'info',
      autoHideDuration: null,
      action: deleteConfirmationAction(async () => {
        try {
          await deleteStudentsFromCoach({
            coachId: user?.id,
            body: [...checked],
          }).unwrap();
          enqueueSnackbar('Students deleted successfully!', {
            variant: 'success',
          });
        } catch (err) {
          enqueueSnackbar(`Failed to delete the students.`, {
            variant: 'error',
          });
        }
      }),
    });
  }, [user, checked]);

  useEffect(() => {
    setDisplayedStudents(students);
  }, [students]);

  useEffect(() => {
    if (searchText == '') {
      setDisplayedStudents(students);
      return;
    }
    setDisplayedStudents(
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.email.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, students]);

  console.log(students);
  console.log(displayedStudents);
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: `calc(100% - ${2 * navBarHeight}px)`,
        py: 2,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'white',
          borderRadius: '15px',
          p: 4,
        }}
      >
        <Stack direction="row" alignItems={'center'} width={'100%'}>
          <Typography fontSize={24} color="#444746" mr={2}>
            Invitation Code: {user?.invitationCode || 'N/A'}
          </Typography>
          <EventAction
            Icon={RefreshIcon}
            title={'Change Invitation Code'}
            onClick={generateInvitationCode}
            isLoading={isUpdatingCoach}
            fontSize={25}
          />
        </Stack>
        <Stack direction="row" alignItems={'center'} width={'100%'}>
          <Typography fontSize={24} color="#444746" mr={1}>
            Students
          </Typography>
          <Typography fontSize={14} color="#444746" mr={2}>
            ({displayedStudents.length})
          </Typography>
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
            sx={{ mr: 2 }}
          />
          <EventAction
            Icon={DeleteForeverIcon}
            title={'Delete Selected Students'}
            onClick={deleteStudent}
            isLoading={isDeletingStudentFromCoach}
            disabled={checked.size == 0}
            fontSize={25}
          />
        </Stack>
        <List sx={{ height: '100%', py: 0, overflowY: 'auto' }}>
          {displayedStudents.map((student) => (
            <ListItem
              key={student.id}
              sx={{
                px: 1,
                py: 0.5,
              }}
              secondaryAction={
                <Checkbox
                  edge="start"
                  onChange={handleToggle(student.id)}
                  checked={checked.has(student.id)}
                />
              }
            >
              <StudentCard key={student.id} student={student} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Container>
  );
};

export default StudentPage;
