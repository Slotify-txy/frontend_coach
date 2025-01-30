import React, { useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

const ActionButton = ({
  color,
  icon,
  tooltip,
  callback,
  disabled = false,
  offset,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Tooltip
        title={tooltip}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset,
                },
              },
            ],
          },
        }}
      >
        <span>
          <IconButton sx={{ color }} onClick={callback} disabled={disabled}>
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ActionButton;
