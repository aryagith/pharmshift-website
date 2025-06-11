'use client';

import Slider from 'react-slick';
import { Box, Typography, Container, Card, CardContent, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const hardcodedRatings = [
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
  const { data: session } = useSession();
  const [ratings, setRatings] = useState(hardcodedRatings);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const dbRatings = await res.json();
          setRatings([...dbRatings, ...hardcodedRatings]);
        }
      } catch {}
    })();
  }, [session]); // Add session as dependency to update after login/submit

  // Check if user has already submitted a review (ignore hardcoded ratings)
  const userId = session?.user?.id;
  const alreadyReviewed = userId && ratings.some(r => ('userId' in r) && r.userId === userId);

  // Track expanded state for each review
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const handleToggleExpand = (idx: number) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

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
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {Array.from({ length: typeof entry.pills === 'number' ? entry.pills : 0 }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 22,
                          height: 10,
                          borderRadius: 8,
                          backgroundColor: '#1B4CD7',
                          boxShadow: '0 1px 4px #1C4ED880',
                        }}
                      />
                    ))}
                    <Typography variant="body2" color="#b0b0b0" ml={1}>
                      {typeof entry.pills === 'number' ? entry.pills : 0}/5
                    </Typography>
                  </Stack>
                  {entry.comment && (
                    <>
                      <Typography variant="body2" gutterBottom sx={{ color: '#fff', mb: 1, minHeight: 36 }}>
                        {expanded[index] || entry.comment.length <= 120
                          ? entry.comment
                          : entry.comment.slice(0, 120) + '...'}
                      </Typography>
                      {entry.comment.length > 120 && (
                        <Box sx={{ textAlign: 'right', mb: 1 }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1C4ED8',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: 600,
                              padding: 0,
                            }}
                            onClick={() => handleToggleExpand(index)}
                          >
                            {expanded[index] ? 'Show less' : 'Show more'}
                          </button>
                        </Box>
                      )}
                    </>
                  )}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                      {/* Only show avatar if entry has a name or image property (for DB reviews) */}
                      {('image' in entry && entry.image && typeof entry.image === 'string') ? (
                        <img
                          src={entry.image}
                          alt={('name' in entry && typeof entry.name === 'string') ? entry.name : 'User'}
                          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #1C4ED8', marginRight: 8 }}
                        />
                      ) : (
                        <Box
                          sx={{ width: 28, height: 28, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, border: '1.5px solid #333' }}
                        >
                          <span style={{ color: '#888', fontSize: 16 }}>
                            {('name' in entry && typeof entry.name === 'string' && entry.name !== 'Anonymous') ? entry.name.charAt(0).toUpperCase() : '👤'}
                          </span>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <Typography variant="caption" color="#b0b0b0" sx={{ fontWeight: 500, lineHeight: 1.1, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {('name' in entry && typeof entry.name === 'string') ? (entry.name === 'Anonymous' ? 'Anonymous' : entry.name) : 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="#888" sx={{ fontSize: 11, lineHeight: 1.1, mt: 0.2 }}>
                          {(() => {
                            // Try to parse and format the date nicely
                            let dateObj: Date | null = null;
                            if (typeof entry.date === 'string') {
                              const parsed = new Date(entry.date);
                              if (!isNaN(parsed.getTime())) dateObj = parsed;
                            }
                            if (dateObj) {
                              // Example: Jun 11, 2025 · 11:31 AM
                              return dateObj.toLocaleString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                                hour: 'numeric', minute: '2-digit', hour12: true
                              }).replace(',', ' ·');
                            }
                            return entry.date;
                          })()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
}
