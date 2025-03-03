import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

const EventAction = ({ title, onClick, Icon, isLoading = false }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        onMouseDown={(e) => e.stopPropagation()} // otherwise, it triggers with onDragStart
        sx={{ padding: 0.2 }}
        aria-label={title}
        loading={isLoading}
      >
        <Icon sx={{ fontSize: 14 }} />
      </IconButton>
    </Tooltip>
  );
};

export default EventAction;
