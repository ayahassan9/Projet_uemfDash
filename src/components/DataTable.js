import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  LinearProgress,
  Button
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * DataTable - Tableau avancé avec tri, filtrage, pagination et exportation
 * 
 * @param {Object} props
 * @param {Array} props.columns - Configuration des colonnes
 * @param {Array} props.data - Données à afficher
 * @param {string} props.title - Titre du tableau
 * @param {boolean} props.loading - Indique si les données sont en cours de chargement
 * @param {Function} props.onRefresh - Fonction pour rafraîchir les données
 */
const DataTable = ({ 
  columns = [], 
  data = [], 
  title = "Données",
  loading = false,
  onRefresh = () => {}
}) => {
  // État de pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // État de tri
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(columns[0]?.id || 'id');
  
  // État de filtrage
  const [filterText, setFilterText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  
  // Ancre pour le menu de filtre
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);

  // Appliquer le filtrage aux données
  const filteredData = React.useMemo(() => {
    return data.filter(row => {
      // Vérifier le texte de recherche global
      if (filterText) {
        const searchTextLower = filterText.toLowerCase();
        const rowMatchesSearch = columns.some(column => {
          const cellValue = row[column.id];
          return cellValue?.toString().toLowerCase().includes(searchTextLower);
        });
        
        if (!rowMatchesSearch) return false;
      }
      
      // Vérifier les filtres par colonne
      for (const [columnId, filterValue] of Object.entries(activeFilters)) {
        if (!filterValue) continue;
        
        const cellValue = row[columnId];
        if (cellValue === undefined) return false;
        
        const cellValueStr = cellValue.toString().toLowerCase();
        const filterValueLower = filterValue.toLowerCase();
        
        if (!cellValueStr.includes(filterValueLower)) return false;
      }
      
      return true;
    });
  }, [data, filterText, activeFilters, columns]);

  // Appliquer le tri
  const sortedData = React.useMemo(() => {
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    
    stabilizedThis.sort((a, b) => {
      const aValue = a[0][orderBy];
      const bValue = b[0][orderBy];
      
      if (bValue < aValue) {
        return order === 'asc' ? 1 : -1;
      }
      if (bValue > aValue) {
        return order === 'asc' ? -1 : 1;
      }
      return a[1] - b[1]; // Préserver l'ordre initial pour les valeurs égales
    });
    
    return stabilizedThis.map(el => el[0]);
  }, [filteredData, order, orderBy]);

  // Appliquer la pagination
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Gestionnaires d'événements
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterMenuOpen = (event, columnId) => {
    setFilterMenuAnchor(event.currentTarget);
    setActiveFilterColumn(columnId);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
    setActiveFilterColumn(null);
  };

  const handleFilterApply = (value) => {
    if (activeFilterColumn) {
      setActiveFilters(prev => ({
        ...prev,
        [activeFilterColumn]: value
      }));
    }
    
    handleFilterMenuClose();
  };

  const handleFilterClear = (columnId) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  };

  const handleClearAll = () => {
    setFilterText('');
    setActiveFilters({});
    setPage(0);
  };

  // Exporter les données au format CSV
  const exportCSV = () => {
    // Entêtes CSV
    const headers = columns.map(column => column.label || column.id).join(',');
    
    // Lignes de données
    const rows = filteredData.map(row => 
      columns.map(column => {
        const cellValue = row[column.id];
        // Échapper les virgules et les guillemets pour le format CSV
        return typeof cellValue === 'string' 
          ? `"${cellValue.replace(/"/g, '""')}"` 
          : cellValue;
      }).join(',')
    ).join('\n');
    
    // Combiner entêtes et lignes
    const csv = `${headers}\n${rows}`;
    
    // Créer le blob et le lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset la page quand le filtre change
  useEffect(() => {
    setPage(0);
  }, [filterText, activeFilters]);

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Barre d'outils avec titre, recherche et options */}
      <Toolbar sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            {title}
          </Typography>
          {Object.entries(activeFilters).map(([columnId, value]) => {
            const column = columns.find(col => col.id === columnId);
            return (
              <Chip
                key={columnId}
                label={`${column?.label || columnId}: ${value}`}
                size="small"
                onDelete={() => handleFilterClear(columnId)}
                sx={{ mr: 1 }}
              />
            );
          })}
          {(filterText || Object.keys(activeFilters).length > 0) && (
            <Chip
              label="Effacer tous les filtres"
              size="small"
              color="primary"
              variant="outlined"
              onClick={handleClearAll}
              sx={{ mr: 1 }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Rechercher..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: filterText && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setFilterText('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 200 }}
          />
          
          <Tooltip title="Rafraîchir les données">
            <IconButton onClick={onRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Exporter CSV">
            <IconButton onClick={exportCSV} disabled={filteredData.length === 0}>
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      
      {loading && (
        <LinearProgress sx={{ height: 3 }} />
      )}
      
      {/* Tableau */}
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell 
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                  align={column.numeric ? 'right' : 'left'}
                  width={column.width}
                  sx={{ 
                    fontWeight: 'bold', 
                    whiteSpace: column.nowrap ? 'nowrap' : 'normal',
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label || column.id}
                    </TableSortLabel>
                    
                    {column.filterable !== false && (
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleFilterMenuOpen(e, column.id)}
                        sx={{ ml: 1 }}
                      >
                        <FilterListIcon 
                          fontSize="small" 
                          color={activeFilters[column.id] ? 'primary' : 'action'} 
                        />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow 
                  key={row.id || rowIndex}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map(column => (
                    <TableCell 
                      key={column.id} 
                      align={column.numeric ? 'right' : 'left'}
                      sx={{ 
                        whiteSpace: column.nowrap ? 'nowrap' : 'normal',
                      }}
                    >
                      {column.render 
                        ? column.render(row[column.id], row) 
                        : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Aucune donnée disponible
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
      />
      
      {/* Menu de filtre par colonne */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
      >
        <Box sx={{ px: 2, pt: 1, pb: 2, width: 250 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filtrer par {columns.find(col => col.id === activeFilterColumn)?.label || activeFilterColumn}
          </Typography>
          
          <TextField
            autoFocus
            size="small"
            fullWidth
            placeholder="Valeur de filtre..."
            defaultValue={activeFilters[activeFilterColumn] || ''}
            sx={{ mb: 1 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              size="small"
              color="inherit"
              onClick={handleFilterMenuClose}
            >
              Annuler
            </Button>
            <Button 
              size="small" 
              variant="contained"
              onClick={() => handleFilterApply(document.querySelector('input[placeholder="Valeur de filtre..."]').value)}
            >
              Appliquer
            </Button>
          </Box>
        </Box>
      </Menu>
    </Paper>
  );
};

export default DataTable;
