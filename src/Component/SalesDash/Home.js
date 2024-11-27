import React from 'react';
import Grid from '@mui/material/Grid';
import Scales from './Sales';
import Demo from './demo';

function Home() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Scales />
      </Grid>
    </Grid>
  );
}

export default Home;
