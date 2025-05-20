import { Box, Container, Grid, Typography, Stack, IconButton, Link } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <Box sx={{  borderTop: '1px solid #333', backgroundColor: '#000', color: '#fff', mt: 0.25 }}>
      <Container sx={{ py: 2 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          maxWidth="md"
          sx={{ margin: '0 auto' }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Company
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">About Us</Link>
              <Link href="#" underline="hover" color="inherit">Careers</Link>
              <Link href="#" underline="hover" color="inherit">Blog</Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Support
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">Contact Us</Link>
              <Link href="#" underline="hover" color="inherit">FAQs</Link>
              <Link href="#" underline="hover" color="inherit">Help Center</Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>


      {/* Bottom Section */}
      <Box sx={{ borderTop: '1px solid #333', py: 3 }}>
        <Container>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            flexWrap="wrap"
          >
            <Typography variant="body2" fontSize={14} textAlign="center">
              © 2024 PharmShift. All rights reserved.
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://youtube.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
