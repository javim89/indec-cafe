import React from "react";
import { TableHead, Box, TableSortLabel, Typography } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import { TableRowStyled, TableCellStyled } from "./EnhancedTable";
import { styled } from '@mui/material/styles';
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof CafeData) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof CafeData;
  label: string;
  numeric: boolean;
}

interface TableSortLabelStyledInterface {
  color?: string;
}

export const TableSortLabelStyled = styled(TableSortLabel)<TableSortLabelStyledInterface>(({ theme, color }) => ({
  color: color,
  "&:hover": {
    color: color,
    '&& $icon': {
      opacity: 1,
      color: color
    },
  },
  "$active": {
    color: color,
    // && instead of & is a workaround for https://github.com/cssinjs/jss/issues/1045
    '&& $icon': {
      opacity: 1,
      color: color
    },
  },
}))

const headCells: readonly HeadCell[] = [
  {
    id: 'place',
    numeric: false,
    disablePadding: true,
    label: 'Lugar',
  },
  {
    id: 'neighborhood',
    numeric: false,
    disablePadding: false,
    label: 'Barrio',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'ARS',
  },
];

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof CafeData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRowStyled color="red">
        <TableCellStyled padding="checkbox" color="black">
        </TableCellStyled>
        {headCells.map((headCell) => (
          <TableCellStyled
            color="#39353b"
            textColor="white"
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{
                  '&.MuiTableSortLabel-root': {
                    color: 'white',
                  },
                  '&.MuiTableSortLabel-root:hover': {
                    color: 'white',
                  },
                  '&.Mui-active': {
                    color: 'white',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
            >
              <Typography fontWeight={600}>{headCell.label}</Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCellStyled>
        ))}
      </TableRowStyled>
    </TableHead>
  );
}

export default EnhancedTableHead;
