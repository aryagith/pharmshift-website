'use client';

import Slider from 'react-slick';
import { Box, Typography, Container, Card, CardContent, Stack } from '@mui/material';

const ratings = [
  {
    pills: 5,
    date: '3/4/2025, 2:09:10 AM',
    comment: 'woah the website looks so good whoever coded it is a genius',
  },
  {
    pills: 3,
    date: '3/4/2025, 7:15:33 PM',
    comment: 'insanely helpful!',
  },
  {
    pills: 5,
    date: '3/3/2025, 7:26:18 PM',
    comment: 'best app ever!!',
  },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export default function SubmittedRatings() {
  return (
    <Box sx={{ py: 10 }}>
      <Container>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Submitted Ratings
        </Typography>

        <Slider {...settings}>
          {ratings.map((entry, index) => (
            <Box key={index} px={1}>
              <Card
                sx={{
                  backgroundColor: '#121212',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  height: 200,  
                }}
              >
                <CardContent>
                    <Typography variant="body2" gutterBottom>
                      <strong>Rating:</strong>
                    </Typography>
                  <Stack direction="row" spacing={1} mb={2}>
                    {Array.from({ length: entry.pills }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 30,
                          height: 14,
                          borderRadius: 10,
                          backgroundColor: '#1B4CD7',
                        }}
                      />
                    ))}
                  </Stack>

                  {/* {entry.pills && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Rating:</strong> {entry.pills} pills
                    </Typography>
                  )} */}

                  {entry.comment && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Comment:</strong> {entry.comment}
                    </Typography>
                  )}

                  <Typography variant="body2">
                    <strong>Date:</strong> {entry.date}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
}
