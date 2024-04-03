import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import { Google, Telegram } from "@mui/icons-material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, realDB } from "../firebase";
import { useNavigate } from "react-router-dom";
import { child, get, getDatabase, ref, set } from "firebase/database";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        successSignIn(userCredential);
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/invalid-credential") {
          createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
              // Signed up
              successSignIn(userCredential);

              // ...
            })
            .catch(error => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
            });
        }
      });
  };

  const successSignIn = (crediantials: any) => {
    const userName = crediantials.user.email?.slice(0, -10);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userName}`)).then(snap => {
      if (snap.exists()) {
        console.log("bor");
      } else {
        set(ref(realDB, `users/${userName}`), {
          userName,
        });
      }
    });
    navigate("/");
  };

  const singInGoogle = () => {
    signInWithPopup(auth, googleProvider).then(info => {
      successSignIn(info);
    });
  };

  return (
    <Grid container component="main" sx={{ height: "100%" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: t =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <Telegram />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={singInGoogle}
              fullWidth
              color="warning"
              variant="contained"
              sx={{ mb: 2 }}
            >
              Sign In
              <Google sx={{ ml: 1 }}></Google>
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
