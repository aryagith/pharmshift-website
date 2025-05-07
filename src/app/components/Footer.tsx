import { Box, Container, Typography, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 6, borderTop: '1px solid #333' }}>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          <Grid item size={{ xs: 6, sm: 3 }}>
            <Typography variant="body1">About Us</Typography>
            <Typography variant="body1">Who we are</Typography>
          </Grid>
          <Grid item size={{ xs: 6, sm: 3 }}>
            <Typography variant="body1">Support</Typography>
            <Typography variant="body1">Contact</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
