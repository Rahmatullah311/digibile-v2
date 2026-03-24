import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetProducts, useDeleteProduct } from 'src/actions/product';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useToolbarSettings } from 'src/components/custom-data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomGridActionsCellItem } from 'src/components/custom-data-grid/grid-actions-cell-item.jsx';

import { ProductTableToolbar } from '../product-table-toolbar';
// import { C } from '@fullcalendar/core/internal-common';
// import { render } from 'nprogress';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

// const HIDE_COLUMNS = { category: false };
// const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
const HIDE_COLUMNS = {};
const HIDE_COLUMNS_TOGGLABLE = [];

// ----------------------------------------------------------------------

export function ProductListView() {
  const confirmDialog = useBoolean();
  const toolbarOptions = useToolbarSettings();
  const { products, productsLoading } = useGetProducts();

  const [tableData, setTableData] = useState(products);
  const [selectedRows, setSelectedRows] = useState({
    type: 'include',
    ids: new Set(),
  });

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const filters = useSetState({
    publish: [],
    stock: [],
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    setTableData(products);
  }, [products]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: filters.state,
  });

  const { deleteProduct, deleteResponse, deleteLoading, deleteError } = useDeleteProduct();

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        console.log('deleteResponse', deleteResponse);
        console.log('deleteLoading', deleteLoading);
        console.log('deleteError', deleteError);
        console.debug('deleteError: ', deleteError);
        await deleteProduct(1333);

        toast.success('Delete success!');
      } catch (error) {
        toast.error(error.message);
      }

      // if (deleteError) {
      //   toast.error(deleteError);
      // }
      // setTableData((prev) => {
      //   prev.results = prev.results.filter((row) => row.id !== id);
      //   return prev;
      // });
    },
    [deleteProduct, deleteResponse, deleteLoading, deleteError]
  );

  useEffect(() => {
    console.log('after delete: ', tableData);
  }, [tableData]);

  const handleDeleteRows = useCallback(() => {
    setTableData((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((row) => !selectedRows.ids.has(row.id));
      }
      return { ...prev, results: (prev.results || []).filter((row) => !selectedRows.ids.has(row.id)) };
    });
    toast.success('Delete success!');
  }, [selectedRows.ids]);

  const columns = useGetColumns({ onDeleteRow: handleDeleteRow }, [tableData]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {selectedRows.ids.size} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product', href: paths.dashboard.product.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add product
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            {...toolbarOptions.settings}
            checkboxSelection
            disableRowSelectionOnClick
            rows={Array.isArray(dataFiltered) ? dataFiltered : dataFiltered?.results ?? []}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            paginationMode="server"
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            onPaginationModelChange={() => {
              setPage(page);
              setPageSize(pageSize);
            }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
              toolbar: () => (
                <ProductTableToolbar
                  filters={filters}
                  canReset={canReset}
                  filteredResults={Array.isArray(dataFiltered) ? dataFiltered.length : dataFiltered?.results?.length ?? 0}
                  selectedRowCount={selectedRows.ids.size}
                  onOpenConfirmDeleteRows={confirmDialog.onTrue}
                  options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
                  /********/
                  settings={toolbarOptions.settings}
                  onChangeSettings={toolbarOptions.onChangeSettings}
                />
              ),
            }}
            slotProps={{
              columnsManagement: {
                getTogglableColumns: () =>
                  columns
                    .filter((col) => !HIDE_COLUMNS_TOGGLABLE.includes(col.field))
                    .map((col) => col.field),
              },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

const useGetColumns = ({ onDeleteRow }) => {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      // {
      //   field: 'category',
      //   headerName: 'Category',
      //   filterable: false,
      // },
      {
        field: 'name',
        headerName: 'Product',
        flex: 1,
        minWidth: 360,
        hideable: false,
        renderCell: (params) => params.name,
        // <RenderCellProduct
        //   params={params}
        //   href={paths.dashboard.product.details(params.row.id)}
        // />
      },
      {
        field: 'store',
        headerName: 'Store',
        flex: 1,
        minWidth: 360,
        hideable: true,
        renderCell: (params) => params.value.name,
      },
      {
        field: 'stock',
        headerName: 'Stock',
        width: 160,
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 160,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 160,
      },
      {
        field: 'is_featured',
        headerName: 'Is Featured',
        width: 160,
      },
      {
        field: 'is_digital',
        headerName: 'Is Digital',
        width: 160,
      },
      {
        field: 'available_from',
        headerName: 'Is available from and to',
        width: 160,
        renderCell: (params) => params.available_from,
      },
      //   {
      //     field: 'inventoryType',
      //     headerName: 'Stock',
      //     width: 160,
      //     type: 'singleSelect',
      //     filterable: false,
      //     valueOptions: PRODUCT_STOCK_OPTIONS,
      //     renderCell: (params) => <RenderCellStock params={params} />,
      //   },
      //   {
      //     field: 'price',
      //     headerName: 'Price',
      //     width: 120,
      //     editable: true,
      //     renderCell: (params) => <RenderCellPrice params={params} />,
      //   },
      //   {
      //     field: 'publish',
      //     headerName: 'Publish',
      //     width: 120,
      //     type: 'singleSelect',
      //     editable: true,
      //     filterable: false,
      //     valueOptions: PUBLISH_OPTIONS,
      //     renderCell: (params) => <RenderCellPublish params={params} />,
      //   },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'Actions',
        width: 64,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          <CustomGridActionsCellItem
            showInMenu
            label="View"
            icon={<Iconify icon="solar:eye-bold" />}
            href={paths.dashboard.product.details(params.row.id)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Edit"
            icon={<Iconify icon="solar:pen-bold" />}
            href={paths.dashboard.product.edit(params.row.id)}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Delete"
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => onDeleteRow(params.row.id)}
            style={{ color: theme.vars.palette.error.main }}
          />,
        ],
      },
    ],
    [theme, onDeleteRow]
  );

  return columns;
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  // Support both array input and paginated object with a `results` array
  const isArrayInput = Array.isArray(inputData);
  let results = isArrayInput ? inputData : (inputData?.results ?? []);

  if (stock?.length) {
    results = results.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish?.length) {
    results = results.filter((product) => publish.includes(product.publish));
  }

  return isArrayInput ? results : { ...inputData, results };
}
