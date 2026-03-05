import React from 'react';

import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';

const BrandFilterForm = ({ filters, setFilter }) => (
  <Stack spacing={2} sx={{ margin: 3 }}>
    <TextField
      label="Search"
      size="small"
      value={filters.search}
      onChange={(e) => {
        setFilter((prev) => ({ ...prev, search: e.target.value }));
      }}
      placeholder="Name or Slug"
    />
  </Stack>
);
export default BrandFilterForm;
