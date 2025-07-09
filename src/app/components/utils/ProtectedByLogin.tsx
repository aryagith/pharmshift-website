"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Dialog, DialogTitle, DialogActions, Button, Typography, Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

export default function ProtectedByLogin({ children }: { children?: React.ReactNode }) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") setOpen(true);
    else setOpen(false);
  }, [status]);

  const handleLogin = () => {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {status === "authenticated" && children}
      <Dialog
        open={open}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            background: "rgba(14,17,24,0.42)",
            borderRadius: "16px",
            border: "1.5px solid rgba(44,48,54,0.26)", // More subtle/darker
            boxShadow: "0 8px 48px 0 rgba(0,0,0,0.65)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            minWidth: { xs: 320, sm: 390 },
            p: 0,
            m: 0,
          }
        }}
        BackdropProps={{
          sx: {
            background: "rgba(0, 0, 0, 0.25) !important",
            backdropFilter: "blur(24px) saturate(180%) !important",
            WebkitBackdropFilter: "blur(24px) saturate(180%) !important",
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          {/* Slot for icon if you want to add one */}
          <DialogTitle
            sx={{
              fontSize: '1.35rem',
              fontWeight: 700,
              width: '100%',
              textAlign: 'center',
              p: 0,
              mb: 1.5,
              color: 'white',
            }}
          >
            Login to use this feature
          </DialogTitle>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "1.11rem",
              mb: 1,
              opacity: 0.97,
              width: "100%",
            }}
          >
            You must be logged in to access this part of the site.
          </Typography>
          <DialogActions
            sx={{
              justifyContent: 'center',
              width: '100%',
              mt: 2,
              gap: 2,
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              sx={{
                minWidth: 120,
                borderColor: '#1C3EB5',
                color: '#1C3EB5',
                background: 'rgba(28,62,181,0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(28,62,181,0.18)',
                  borderColor: '#1C3EB5',
                  color: '#fff',
                },
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.18s',
                boxShadow: 'none',
                height: 48,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogin}
              variant="contained"
              sx={{
                minWidth: 120,
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                fontSize: '1rem',
                backgroundColor: '#1C3EB5',
                color: '#fff',
                boxShadow: 'none',
                height: 48,
                '&:hover': {
                  backgroundColor: '#23336C',
                  color: '#fff',
                },
              }}
            >
              Login
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <style jsx global>{`
        .MuiDialog-root .MuiBackdrop-root {
          background: rgba(0, 0, 0, 0.25) !important;
          backdrop-filter: blur(24px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
        }
      `}</style>
    </>
  );
}
