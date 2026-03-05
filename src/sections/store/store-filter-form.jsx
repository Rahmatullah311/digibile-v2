import React from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import UserSelector from 'src/components/custom-form-components/universal-user-selector-v1';

import { STORE_STATUS_OPTIONS } from './constants';

const StoreFilterForm = ({ filters, setFilter }) => (
  <Stack spacing={2} sx={{ margin: 3 }}>
    <UserSelector
      value={filters.owner}
      label="Owner"
      onChange={(id) => {
        setFilter((prev) => ({ ...prev, owner: id }));
      }}
    />
    <TextField
      name="search"
      label="Search"
      size="small"
      value={filters.search}
      onChange={(e) => {
        setFilter((prev) => ({ ...prev, search: e.target.value }));
      }}
    />
    <TextField
      select
      label="Status"
      size="small"
      value={filters.status}
      onChange={(e) => {
        setFilter((prev) => ({ ...prev, status: e.target.value }));
      }}
    >
      <MenuItem>All</MenuItem>
      {STORE_STATUS_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    <Stack direction="row">
      <FormControlLabel
        control={
          <Switch
            checked={filters.verified === true}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, verified: e.target.checked }));
            }}
          />
        }
        label="Verified Stores"
      />
      <FormControlLabel
        control={
          <Switch
            checked={filters.email_verified === true}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, email_verified: e.target.checked }));
            }}
          />
        }
        label="Verified Email"
      />
      <FormControlLabel
        control={
          <Switch
            checked={filters.phone_verified === true}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, phone_verified: e.target.checked }));
            }}
          />
        }
        label="Verified Phone"
      />
    </Stack>
    <Stack direction="row" spacing={2}>
      <TextField
        type="date"
        name="date_joined_from"
        size="small"
        label="Joined From"
        InputLabelProps={{ shrink: true }}
        value={filters.date_joined_from ?? ''}
        onChange={(e) => {
          setFilter((prev) => ({ ...prev, date_joined_from: e.target.value }));
        }}
      />

      <TextField
        type="date"
        size="small"
        name="date_joined_to"
        label="Joined To"
        InputLabelProps={{ shrink: true }}
        value={filters.date_joined_to ?? ''}
        onChange={(e) => {
          setFilter((prev) => ({ ...prev, date_joined_to: e.target.value }));
        }}
      />
      <Button
        variant="outlined"
        onClick={() => {
          setFilter({
            owner: '',
            search: '',
            status: '',
            is_active: true,
            is_staff: false,
            email_verified: '',
            phone_verified: '',
            date_joined_from: '',
            date_joined_to: '',
          });
        }}
      >
        Reset filters
      </Button>
    </Stack>
  </Stack>
);
export default StoreFilterForm;
