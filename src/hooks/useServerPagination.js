import { useState, useCallback } from 'react';

export function useServerPagination(initialPageSize = 10) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });

  const pageSizeOptions = [5, 10, 25, 50, 100];

  const onPaginationModelChange = useCallback((model) => {
    setPaginationModel(model);
  }, []);

  return {
    paginationModel,
    onPaginationModelChange,
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    pageSizeOptions,
  };
}

export function useTableServerPagination(initialRowsPerPage = 10) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(1); // 🔥 reset page
  }, []);

  return {
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
