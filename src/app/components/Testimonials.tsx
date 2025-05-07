import { Container, Typography, Card, CardContent, Grid } from '@mui/material';

const testimonials = [
  {
    name: 'Jane Doe',
    quote: 'PharmShift helped me pass my OSCE with confidence. The quizzes are gold.',
  },
  {
    name: 'John Smith',
    quote: 'The AI chatbot is like a real tutor. Super helpful!',
  },
];

export default function Testimonials() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        What Students Say
      </Typography>
      <Grid container spacing={4}>
        {testimonials.map(({ name, quote }) => (
          <Grid item key={name} size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="body1">"{quote}"</Typography>
                <Typography variant="subtitle2" sx={{ mt: 1, textAlign: 'right' }}>
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
