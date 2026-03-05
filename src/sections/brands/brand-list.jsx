import { mutate } from 'swr';
import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useMemo, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useServerPagination } from 'src/hooks/useServerPagination';

import { endpoints } from 'src/lib/axios';
import { useGetBrands, useDeleteBrand } from 'src/actions/dashboard/brand';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import BrandFilterForm from './brand-filter-form';

const BrandList = () => {
  const { paginationModel, onPaginationModelChange, page, pageSize, pageSizeOptions } =
    useServerPagination();
  const [filters, setFilter] = useState({
    search: '',
  });
  const { brands, brandLoading, brandError, mutateBrands } = useGetBrands({
    page,
    pageSize,
    filters,
  });
  const { deleteBrand, deleteBrandLoading, deleteBrandError } = useDeleteBrand();

  useEffect(() => {
    try {
      brandError && toast.error(brandError.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [brands, brandLoading, brandError]);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const hideConfirmDialog = () => {
    setConfirmDelete({ open: false, id: null });
  };
  const handleDeleteRow = async (id) => {
    try {
      const rowId = confirmDelete.id;
      await deleteBrand({ brandId: rowId });
      if (deleteBrandError) {
        toast.error(deleteBrandError.message);
      } else {
        toast.success('Brand deleted successfully');
        mutate(endpoints.brand.list);
        setConfirmDelete({ open: false, id: null });
      }

      // Refresh the brand list after deletion
    } catch (error) {
      toast.error(error?.message || 'Failed to delete brand');
    }
  };

  const requestDeleteBrand = (brandId) => {
    setConfirmDelete({ open: true, id: brandId });
  };
  const columns = useGetColumns({ onDeleteRow: requestDeleteBrand });

  useEffect(() => {
    mutateBrands();
  }, [filters, pageSize, page, mutateBrands]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDelete.open}
      onClose={hideConfirmDialog}
      title="Delete Category"
      content="Are you sure want to delete?"
      action={
        <LoadingButton
          loading={deleteBrandLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteRow}
        >
          Delete
        </LoadingButton>
      }
    />
  );
  return (
    <>
      <DataGrid
        columns={columns}
        rows={brands.results}
        paginationMode="server"
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        filterMode="server"
        onPaginationModelChange={onPaginationModelChange}
        loading={brandLoading}
        rowCount={brands.count}
        rowHeight={64}
        slots={{ toolbar: BrandFilterForm }}
        slotProps={{ toolbar: { filters, setFilter } }}
        sx={{ '& .MuiDataGrid-cell': { alignItems: 'bottom' } }}
      />
      {renderConfirmDialog()}
    </>
  );
};

const useGetColumns = ({ onDeleteRow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const columns = useMemo(
    () => [
      {
        field: 'thumbnail',
        headerName: 'Logo',
        flex: isSmall ? 0.5 : 0.4,
        minWidth: isSmall ? 60 : 80,
        filterable: false,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) =>
          params.row.thumbnail ? (
            <Avatar src={params.row.thumbnail} alt={params.row.name} />
          ) : (
            <Avatar>{params.row.name[0].toUpperCase()}</Avatar>
          ),
      },
      {
        field: 'name',
        headerName: 'Brand',
        flex: isSmall ? 1 : 1.2,
        minWidth: 140,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'Actions',
        flex: isSmall ? 0.7 : 0.8,
        minWidth: isSmall ? 60 : 100,
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
            href={paths.dashboard.brand.edit(params.row.id)}
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
    ],
    [theme, onDeleteRow, isSmall]
  );
  return columns;
};

export default BrandList;
