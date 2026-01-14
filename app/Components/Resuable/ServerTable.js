import React, { useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useTheme } from "@mui/material";

const ServerTable = ({
  columns,
  data = [],
  isError,
  isRefetching,
  isLoading,
  columnFilters,
  setColumnFilters,
  globalFilter,
  setGlobalFilter,
  pagination,
  setPagination,
  sorting,
  setSorting,
  meta = {},
}) => {
  const theme = useTheme();

  const [rowSelection, setRowSelection] = useState({});

  const table = useMaterialReactTable({
    columns,
    data,

    getRowId: (row) => row.id,

    initialState: {
      showColumnFilters: false,
      density: "compact",
    },

    // Server-side mode
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,

    // Table handlers
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    onRowSelectionChange: setRowSelection,

    // Features
    enableRowSelection: true,
    enableColumnResizing: true,
    enableHiding: true,
    enableDensityToggle: true,
    enableColumnActions: true,
    enableColumnFilters: true,
    enableColumnFilterModes: true,

    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,

    muiTablePaginationProps: {
      rowsPerPageOptions: [10, 25, 50, 100],
      showFirstButton: true,
      showLastButton: true,
    },

    muiTableContainerProps: {
      sx: {
        height: "calc(100vh - 320px)",
        overflow: "auto",
      },
    },

    muiTableHeadProps: {
      sx: {
        position: "sticky",
        top: 0,
        zIndex: 2,
      },
    },

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },

    rowCount: meta?.totalRowCount ?? 0,

    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      sorting,
      rowSelection,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default ServerTable;
