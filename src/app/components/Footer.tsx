import { Box, Container, Typography, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 6, borderTop: '1px solid #333' }}>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body1" fontSize={20}>About Us</Typography>
            <Typography variant="body1" fontSize={16}>Who we are</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body1" fontSize={20}>Support</Typography>
            <Typography variant="body1" fontSize={16}>Contact</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
