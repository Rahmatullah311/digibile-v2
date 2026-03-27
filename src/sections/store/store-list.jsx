import { mutate } from 'swr';
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
import { useGetStores, useDeleteStore } from 'src/actions/dashboard/store';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import StoreFilterForm from './store-filter-form';

const StoreList = () => {
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const hideConfirmDialog = () => {
    setConfirmDelete({ open: false, id: null });
  };
  const { page, pageSize, onPaginationModelChange, paginationModel, pageSizeOptions } =
    useServerPagination();

  useEffect(() => {
    console.debug('paginationModel', paginationModel);
  }, [paginationModel]);

  const requestDeleteStore = (storeId) => {
    setConfirmDelete({ open: true, id: storeId });
  };
  const handleDeleteStore = async () => {
    try {
      await deleteStore(
        { id: confirmDelete.id },
        {
          onSuccess: () => {
            toast.success('Store deleted successfuly');
            mutate(endpoints.store.list);
            setConfirmDelete({ open: false, id: null });
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = useGetColumns({ onDeleteRow: requestDeleteStore });
  const { deleteStore, deleteStoreLoading, deleteStoreData } = useDeleteStore();

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDelete.open}
      onClose={hideConfirmDialog}
      title="Delete Category"
      content="Are you sure want to delete?"
      action={
        <LoadingButton
          loading={deleteStoreLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteStore}
        >
          Delete
        </LoadingButton>
      }
    />
  );

  const [filters, setFilter] = useState({
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
  const onFilterChange = (newFilters) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const { stores, storesIsLoading, mutateStores } = useGetStores({
    page,
    page_size: pageSize,
    filters,
  });

  useEffect(() => {
    mutateStores();
    console.debug('filters', filters);
  }, [filters, page, pageSize, mutateStores, deleteStoreData]);

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
        rows={stores?.results ?? []}
        paginationMode="server"
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onPaginationModelChange={onPaginationModelChange}
        loading={storesIsLoading}
        rowCount={stores?.count ?? 0}
        rowHeight={64}
        slots={{ toolbar: StoreFilterForm }}
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
    const STORE_STATUS_COLORS = {
      pending: 'warning',
      active: 'success',
      rejected: 'default', // you can pick 'error' if you prefer
      banned: 'error',
    };

    return [
      {
        field: 'name',
        headerName: 'Store',
        flex: isSmall ? 1 : 1.2,
        minWidth: 200,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar
              alt={`${params.row.name}`}
              src={params.row.logo_thumbnail}
              sx={{ width: 36, height: 36 }}
            />

            <Stack
              sx={{
                minWidth: 0,
                lineHeight: 1.1, // 👈 KEY
              }}
            >
              {/* Name */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5} // 👈 tighter
                sx={{ mt: '2px', minWidth: 0 }} // 👈 controlled margin
              >
                <Iconify
                  icon={
                    params.row.verified ? 'eva:checkmark-circle-2-fill' : 'eva:close-circle-fill'
                  }
                  width={20} // 👈 smaller icon
                  height={14}
                  sx={{ flexShrink: 0 }}
                  color={params.row.verified ? 'green' : 'red'}
                />
                <Link
                  component={RouterLink}
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
                  title={`${params.row.name}`}
                  href={paths.dashboard.store.profile(params.row.id)}
                >
                  {params.row.name}
                </Link>
              </Stack>

              {/* Email + Verification */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5} // 👈 tighter
                sx={{ mt: '2px', minWidth: 0 }} // 👈 controlled margin
              >
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
                  title={params.row.description}
                >
                  {params.row.description}
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
          <Stack
            spacing={1}
            sx={{
              paddingTop: 1,
              minWidth: 0,
              lineHeight: 1.1, // 👈 KEY
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify
                icon={
                  params.row.phone_verified
                    ? 'eva:checkmark-circle-2-fill'
                    : 'eva:close-circle-fill'
                }
                color={params.row.phone_verified ? 'green' : 'red'}
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify
                icon={
                  params.row.email_verified
                    ? 'eva:checkmark-circle-2-fill'
                    : 'eva:close-circle-fill'
                }
                color={params.row.email_verified ? 'green' : 'red'}
                width={16}
                height={16}
              />
              <Box
                component="span"
                title={params.row.email} // shows full phone on hover
              >
                {params.row.email}
              </Box>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: isSmall ? 1 : 1.2,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Label variant="soft" color={STORE_STATUS_COLORS[params.row.status] || 'default'}>
            {params.row.status}
          </Label>
        ),
      },
      {
        field: 'created_at',
        headerName: 'Joined at',
        flex: 0.5,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
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
            // href={paths.dashboard.brand.details(params.row.id)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Edit"
            icon={<Iconify icon="solar:pen-bold" />}
            href={paths.dashboard.store.edit(params.row.id)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Delete"
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            href={paths.dashboard.store.list}
            onClick={() => onDeleteRow(params.row.id)}
            sx={{ color: theme.vars.palette.error.main }}
          />,
        ],
      },
    ];
  }, [isSmall, onDeleteRow, theme]);
  return columns;
};

export default StoreList;
