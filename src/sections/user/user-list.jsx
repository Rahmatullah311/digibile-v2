import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';
import { useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useServerPagination } from 'src/hooks/useServerPagination';

import { endpoints } from 'src/lib/axios';
import { useGetUsers, useDeleteUser } from 'src/actions/dashboard/user';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import UserFilterForm from './user-filter-form';

const UserList = ({
  rowSelection = false,
  disableMultipleRowSelection = false,
  rowSelectionModel = { type: 'include', ids: new Set() },
  onRowSelectionModelChange = null,
}) => {
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const hideConfirmDialog = () => {
    setConfirmDelete({ open: false, id: null });
  };
  const { page, pageSize, onPaginationModelChange, paginationModel, pageSizeOptions } =
    useServerPagination();

  const requestDeleteUser = (userId) => {
    setConfirmDelete({ open: true, id: userId });
  };
  const handleDeleteUser = async () => {
    try {
      await deleteUser({ id: confirmDelete.id });
      if (deleteUserError) {
        toast.error(deleteUserError.message);
      } else {
        toast.success('User deleted successfuly');
        mutate(endpoints.user.list);
        setConfirmDelete({ open: false, id: null });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = useGetColumns({ onDeleteRow: requestDeleteUser });
  const { deleteUser, deleteUserLoading, deleteUserError } = useDeleteUser();

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDelete.open}
      onClose={hideConfirmDialog}
      title="Delete Category"
      content="Are you sure want to delete?"
      action={
        <LoadingButton
          loading={deleteUserLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteUser}
        >
          Delete
        </LoadingButton>
      }
    />
  );

  const [filters, setFilter] = useState({
    search: '',
    status: '',
    is_active: true,
    is_staff: false,
    email_verified: '',
    phone_verified: '',
    date_joined_from: '',
    date_joined_to: '',
  });
  const onFilterChange = (newFilters) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const { users, userLoading, mutate } = useGetUsers({ page, pageSize, filters });

  useEffect(() => {
    mutate();
  }, [filters, page, pageSize, mutate]);

  return (
    <Card
      sx={{
        minHeight: 640,
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
      }}
    >
      <DataGrid
        columns={columns}
        rows={users.results}
        paginationMode="server"
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        filterMode="server"
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) =>
          onRowSelectionModelChange(newRowSelectionModel)
        }
        checkboxSelection={rowSelection}
        disableMultipleRowSelection={disableMultipleRowSelection}
        onFilterModelChange={onFilterChange}
        onPaginationModelChange={onPaginationModelChange}
        loading={userLoading}
        rowCount={users.count}
        rowHeight={64}
        slots={{ toolbar: UserFilterForm }}
        slotProps={{ toolbar: { filters, setFilter } }}
        sx={{ '& .MuiDataGrid-cell': { alignItems: 'bottom' } }}
      />
      {renderConfirmDialog()}
    </Card>
  );
};

const useGetColumns = ({ onDeleteRow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = useMemo(() => {
    const USER_STATUS_COLORS = {
      pending: 'warning',
      active: 'success',
      rejected: 'default', // you can pick 'error' if you prefer
      banned: 'error',
    };

    return [
      {
        field: 'first_name',
        headerName: 'Name',
        flex: isSmall ? 1 : 1.2,
        minWidth: 200,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar
              alt={`${params.row.first_name} ${params.row.last_name}`}
              src={params.row.avatar_thumbnail}
              sx={{ width: 36, height: 36 }}
            />

            <Stack
              sx={{
                minWidth: 0,
                lineHeight: 1.1, // 👈 KEY
              }}
            >
              {/* Name */}
              <Link
                component={RouterLink}
                href={paths.dashboard.user.account(params.row.id)}
                color="inherit"
                sx={{
                  typography: 'body2',
                  fontWeight: 500,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 2, // 👈 reduce height
                }}
                title={`${params.row.first_name} ${params.row.last_name}`}
              >
                {params.row.first_name} {params.row.last_name}
              </Link>

              {/* Email + Verification */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5} // 👈 tighter
                sx={{ mt: '2px', minWidth: 0 }} // 👈 controlled margin
              >
                <Iconify
                  icon={
                    params.row.email_verified
                      ? 'eva:checkmark-circle-2-fill'
                      : 'eva:close-circle-fill'
                  }
                  width={20} // 👈 smaller icon
                  height={14}
                  sx={{ flexShrink: 0 }}
                  color={params.row.email_verified ? 'success.main' : 'text.disabled'}
                />

                <Box
                  component="span"
                  sx={{
                    fontSize: 12, // 👈 smaller text
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                  }}
                  title={params.row.email}
                >
                  {params.row.email}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: isSmall ? 1 : 1.2,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon={
                params.row.phone_verified ? 'eva:checkmark-circle-2-fill' : 'eva:close-circle-fill'
              }
              color={params.row.phone_verified ? 'green' : 'text.disabled'}
              width={16}
              height={16}
            />
            <Box
              component="span"
              title={params.row.phone} // shows full phone on hover
            >
              {params.row.phone}
            </Box>
          </Stack>
        ),
      },
      {
        field: 'is_active',
        headerName: 'Is Active',
        renderCell: (params) =>
          params.row.is_active ? (
            <Iconify icon="eva:checkmark-circle-2-fill" color="green" />
          ) : (
            <Iconify icon="eva:close-circle-fill" color="red" />
          ),
        flex: 0.5,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
      },

      {
        field: 'status',
        headerName: 'Status',
        flex: isSmall ? 1 : 1.2,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Label variant="soft" color={USER_STATUS_COLORS[params.row.status] || 'default'}>
            {params.row.status}
          </Label>
        ),
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'Actions',
        flex: isSmall ? 1 : 1.2,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          <CustomGridActionsCellItem
            showInMenu
            label="View"
            icon={<Iconify icon="solar:eye-bold" />}
            href={paths.dashboard.brand.details(params.row.id)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Edit"
            icon={<Iconify icon="solar:pen-bold" />}
            href={paths.dashboard.user.edit(params.row.id)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Delete"
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => onDeleteRow(params.row.id)}
            sx={{ color: theme.vars.palette.error.main }}
          />,
        ],
      },
    ];
  }, [isSmall, onDeleteRow, theme]);
  return columns;
};

export default UserList;
