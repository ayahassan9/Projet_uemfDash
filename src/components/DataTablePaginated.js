import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Typography, Box, LinearProgress, Alert, Button,
  FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Enhanced data table component with pagination, sorting, filtering
 * optimized for large datasets
 * 
 * @param {Object} props Component properties
 * @param {Array} props.data Array of data objects to display
 * @param {Array} props.columns Array of column definitions
 * @param {Boolean} props.loading Whether data is loading
 * @param {String} props.error Error message if any
 * @param {Function} props.onPageChange Function called when page changes (server pagination)
 * @param {Function} props.onRowsPerPageChange Function called when rows per page changes
 * @param {Number} props.totalRows Total number of rows (for server pagination)
 * @param {Number} props.page Current page (for server pagination)
 * @param {Number} props.rowsPerPage Rows per page (for server pagination)
 * @param {Boolean} props.serverPagination Whether to use server-side pagination
 */
const DataTablePaginated = ({ 
  data = [], 
  columns = [], 
  loading = false,
  error = null,
  onPageChange,
  onRowsPerPageChange,
  totalRows,
  page: serverPage = 0,
  rowsPerPage: serverRowsPerPage = 10,
  serverPagination = false
}) => {
  // State for client-side pagination, sorting, filtering
  const [clientPage, setClientPage] = useState(0);
  const [clientRowsPerPage, setClientRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [filterValues, setFilterValues] = useState({});
  const [visibleData, setVisibleData] = useState([]);
  
  // Current page and rows per page (either client or server side)
  const page = serverPagination ? serverPage : clientPage;
  const rowsPerPage = serverPagination ? serverRowsPerPage : clientRowsPerPage;
  
  // Update visible data when data, pagination, sorting, or filtering changes
  useEffect(() => {
    if (!serverPagination) {
      // Filter data
      let filtered = filterData(data);
      
      // Sort data
      if (orderBy) {
        filtered = sortData(filtered);
      }
      
      // Store filtered count for pagination display
      setVisibleData(filtered);
    } else {
      // When using server pagination, don't filter/sort client-side
      setVisibleData(data);
    }
  }, [data, orderBy, order, filterValues, serverPagination]);
  
  // Filter data by column values
  const filterData = (dataToFilter) => {
    if (Object.keys(filterValues).length === 0) return dataToFilter;
    
    return dataToFilter.filter(item => {
      return Object.entries(filterValues).every(([key, value]) => {
        if (!value) return true;
        
        const itemValue = item[key];
        if (itemValue === null || itemValue === undefined) return false;
        
        // Case insensitive string comparison
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  };
  
  // Sort data by column
  const sortData = (dataToSort) => {
    const isAsc = order === 'asc';
    return [...dataToSort].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      // Handle nulls
      if (aValue === null) return isAsc ? -1 : 1;
      if (bValue === null) return isAsc ? 1 : -1;
      
      // Sort numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isAsc ? aValue - bValue : bValue - aValue;
      }
      
      // Sort strings
      return isAsc
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };
  
  // Handle client-side pagination
  const handleClientPageChange = (event, newPage) => {
    setClientPage(newPage);
  };
  
  const handleClientRowsPerPageChange = (event) => {
    setClientRowsPerPage(parseInt(event.target.value, 10));
    setClientPage(0);
  };
  
  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Handle filtering
  const handleFilterChange = (columnId, value) => {
    setFilterValues(prev => ({
      ...prev,
      [columnId]: value
    }));
    
    // Reset to first page when filter changes
    if (!serverPagination) {
      setClientPage(0);
    }
  };
  
  const clearFilters = () => {
    setFilterValues({});
    if (!serverPagination) {
      setClientPage(0);
    }
  };
  
  // Get currently visible rows (for client-side pagination)
  const getCurrentRows = () => {
    if (serverPagination) {
      return visibleData;
    }
    
    const startIndex = clientPage * clientRowsPerPage;
    return visibleData.slice(startIndex, startIndex + clientRowsPerPage);
  };
  
  // Count total visible rows
  const totalVisibleRows = serverPagination ? totalRows : visibleData.length;
  
  // Determine if we have active filters
  const hasActiveFilters = Object.values(filterValues).some(value => !!value);
  
  // Determine if table has no data to show
  const noDataToShow = !loading && !error && getCurrentRows().length === 0;
  
  return (
    <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      {/* Filter header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" alignItems="center">
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle2">
            Filtres
          </Typography>
          
          {hasActiveFilters && (
            <Button
              startIcon={<ClearIcon />}
              size="small"
              onClick={clearFilters}
              sx={{ ml: 2 }}
            >
              Effacer
            </Button>
          )}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {totalVisibleRows} {totalVisibleRows === 1 ? 'étudiant' : 'étudiants'} 
          {hasActiveFilters ? ' (filtrés)' : ''}
        </Typography>
      </Box>
      
      {/* Filter controls */}
      {columns.length > 0 && (
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {columns
            .filter(column => column.filterable !== false)
            .map(column => (
              <FormControl key={column.id} size="small" sx={{ minWidth: 150, maxWidth: 300 }}>
                <InputLabel id={`filter-label-${column.id}`}>{column.label}</InputLabel>
                <Select
                  labelId={`filter-label-${column.id}`}
                  id={`filter-${column.id}`}
                  value={filterValues[column.id] || ''}
                  label={column.label}
                  onChange={(e) => handleFilterChange(column.id, e.target.value)}
                >
                  <MenuItem value="">
                    <em>Tous</em>
                  </MenuItem>
                  
                  {/* Generate filter options from data for this column */}
                  {Array.from(new Set(data.map(item => item[column.id])))
                    .filter(Boolean)
                    .sort((a, b) => String(a).localeCompare(String(b)))
                    .map(value => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            ))}
        </Box>
      )}
      
      {/* Applied filters */}
      {hasActiveFilters && (
        <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(filterValues).map(([columnId, value]) => {
            if (!value) return null;
            
            const column = columns.find(col => col.id === columnId);
            return (
              <Chip
                key={columnId}
                label={`${column?.label || columnId}: ${value}`}
                size="small"
                onDelete={() => handleFilterChange(columnId, '')}
              />
            );
          })}
        </Box>
      )}
      
      {/* Loading indicator */}
      {loading && <LinearProgress />}
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* No data message */}
      {noDataToShow && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Aucune donnée à afficher
            {hasActiveFilters && " avec les filtres appliqués"}
          </Typography>
          
          {hasActiveFilters && (
            <Button 
              variant="text" 
              color="primary" 
              onClick={clearFilters}
              sx={{ mt: 2 }}
            >
              Effacer les filtres
            </Button>
          )}
        </Box>
      )}
      
      {/* Data table */}
      {!error && getCurrentRows().length > 0 && (
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth, width: column.width }}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{ fontWeight: 'bold' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={{ ...visuallyHidden }}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                      
                      {/* Sort indicator */}
                      {orderBy === column.id && (
                        <SortIcon sx={{ ml: 1, fontSize: 16 }} />
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {getCurrentRows().map((row, rowIndex) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.ID || rowIndex}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Pagination controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalVisibleRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={serverPagination ? onPageChange : handleClientPageChange}
        onRowsPerPageChange={serverPagination ? onRowsPerPageChange : handleClientRowsPerPageChange}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
      />
    </Paper>
  );
};

export default DataTablePaginated;
