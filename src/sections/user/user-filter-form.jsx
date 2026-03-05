import { Stack, Switch, MenuItem, TextField, FormControlLabel } from '@mui/material';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'banned', label: 'Banned' },
];

const UserFilterForm = ({ filters, setFilter }) => (
  <Stack spacing={2} sx={{ margin: 3 }}>
    <TextField
      label="Search"
      size="small"
      value={filters.search}
      onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
      placeholder="Email, name or phone"
    />

    {/* Status */}
    <TextField
      select
      label="Status"
      size="small"
      value={filters.status}
      onChange={(e) => {
        setFilter((prev) => ({ ...prev, status: e.target.value }));
      }}
    >
      {STATUS_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>

    {/* Boolean filters */}
    <Stack direction="row" spacing={2}>
      <FormControlLabel
        control={
          <Switch
            checked={filters.is_active === true}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, is_active: e.target.checked }));
            }}
          />
        }
        label="Active"
      />

      <FormControlLabel
        control={
          <Switch
            checked={filters.is_staff === true}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, is_staff: e.target.checked }));
            }}
          />
        }
        label="Staff"
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
        label="Email Verified"
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
        label="Phone Verified"
      />
    </Stack>

    {/* Date range */}
    <Stack direction="row" spacing={2}>
      <TextField
        type="date"
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
        label="Joined To"
        InputLabelProps={{ shrink: true }}
        value={filters.date_joined_to ?? ''}
        onChange={(e) => {
          setFilter((prev) => ({ ...prev, date_joined_to: e.target.value }));
        }}
      />
    </Stack>
  </Stack>
);

export default UserFilterForm;
