import React from "react";
import { Paper, Table, TableContainer, TableBody, TableRow, TableCell, TablePagination, Typography } from "@mui/material";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHeads";
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

interface TableRowInterface {
  color: string;
  oddColor?: string;
  hoverColor?: string;
}

interface TableCellStyledInterface {
  color?: string;
  textColor?: string;
}

export const TableRowStyled = styled(TableRow)<TableRowInterface>(({ theme, color, oddColor, hoverColor }) => ({
  backgroundColor: oddColor,
  '&:nth-of-type(odd)': {
    backgroundColor: color,
  },
  '&:hover': {
    backgroundColor: hoverColor
  },
}))

export const TableCellStyled = styled(TableCell)<TableCellStyledInterface>(({ theme, color, textColor }) => ({
  border: "1px solid black",
  backgroundColor: color,
  color: textColor,
  width: 1
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTable = ({ data }: CafeDataArray) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof CafeData>('price');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof CafeData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n: CafeData) => n.place);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data],
  );

  const theme = useTheme();

  const getColor = (price: number): string => {
    switch (true) {
      case price > 1000 && price <= 1500:
        return theme.palette.warning.main;
      case price >= 1500:
        return theme.palette.error.main;
      default:
        return theme.palette.success.main;
    }
  }

  const getOddColor = (price: number): string => {
    switch (true) {
      case price > 1000 && price <= 1500:
        return theme.palette.warning.light;
      case price >= 1500:
        return theme.palette.error.light;
      default:
        return theme.palette.success.light;
    }
  }

  const getHoverColor = (price: number): string => {
    switch (true) {
      case price > 1000 && price <= 1500:
        return theme.palette.warning.dark;
      case price >= 1500:
        return theme.palette.error.dark;
      default:
        return theme.palette.success.dark;
    }
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={'medium'}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.place);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRowStyled
                  onClick={(event) => handleClick(event, row.place)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.place}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                  color={getColor(row.price)}
                  oddColor={getOddColor(row.price)}
                  hoverColor={getHoverColor(row.price)}
                >
                  <TableCellStyled padding="checkbox" color={getHoverColor(row.price)}>
                  </TableCellStyled>
                  <TableCellStyled
                    component="th"
                    id={labelId}
                    scope="row"
                  >
                    <Typography fontWeight={600}>{row.place.toLocaleUpperCase()}</Typography>
                  </TableCellStyled>
                  <TableCellStyled>{row.neighborhood.toLocaleUpperCase()}</TableCellStyled>
                  <TableCellStyled>{row.price}</TableCellStyled>
                </TableRowStyled>
              );
            })}
            {/* {emptyRows > 0 && (
                <TableRowStyled
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRowStyled>
              )} */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
};

export default EnhancedTable;