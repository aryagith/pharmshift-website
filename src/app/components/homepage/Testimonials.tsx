import { Container, Typography, Card, CardContent, Grid } from '@mui/material';

const testimonials = [
  {
    name: 'Walid Duri',
    quote: 'The quizzes are gold.',
  },
  {
    name: 'Umar Faruk Saini',
    quote: 'The AI chatbot is like a real tutor. Super helpful!',
  },
];

export default function Testimonials() {
  return (
    <Container sx={{ py: 8, textAlign: 'center', color: 'white' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        What Students Say
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {testimonials.map(({ name, quote }) => (
          <Grid key={name} item xs={12} sm={6} md={5}>
            <Card
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // for Safari
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
              elevation={3}
            >
              <CardContent>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  “{quote}”
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'right', fontWeight: 'bold' }}>
                  – {name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
