import * as React from 'react';
import Box from '@mui/material/Box';
import data from "./data/data.json";
import EnhancedTable from './components/EnhancedTable';

export default function App() {
  return (
    <Box sx={{ width: '100%' }}>
      <EnhancedTable data={data} />
    </Box>
  );
}