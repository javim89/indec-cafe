import * as React from 'react';
import Box from '@mui/material/Box';
import data from "./data/data.json";
import EnhancedTable from './components/EnhancedTable';
import { Container } from '@mui/material';

export default function App() {
  return (
    <Container sx={{ bgcolor: "primary.main" }} maxWidth={false}>
      <Box>
        <EnhancedTable data={data} />
      </Box>
    </Container>
  );
}