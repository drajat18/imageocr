import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firabase'; // Import the Firebase authentication instance
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import the Firebase function to create a user
import { doc, setDoc, collection, addDoc, getDocs, getFirestore } from "firebase/firestore"; // Import Firestore functions
import { useState } from 'react';
import firebase from "firebase/compat/app";
import { firebaseDb } from "../firabase";

// Required for side-effects
import "firebase/firestore";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [uid, setUid] = useState('');
  const currentYear = new Date().getFullYear();
  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    setUid(uid);
    const restaurantsRef = collection(firebaseDb, "restaurants");
  
    try {
      // Create a reference to the user document
      const userRef = doc(restaurantsRef, uid);
      await setDoc(userRef, { uid }); // Set UID as a property
      console.log("User document created with ID:", uid);
  
      // Get current year
      const currentYear = new Date().getFullYear().toString();
  
      // Create a reference to the year collection within the user document
      const yearCollectionRef = collection(userRef, currentYear);
  
      // Create documents for months within the year collection
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < monthNames.length; i++) {
        const monthDocRef = doc(yearCollectionRef, monthNames[i]);
        await setDoc(monthDocRef, { month: monthNames[i] });
  
        // Create a weeks collection within each month document
        const weeksCollectionRef = collection(monthDocRef, "weeks");
  
        // Create documents for weeks within the weeks collection
        for (let week = 1; week <= 4; week++) {
          const weekDocRef = doc(weeksCollectionRef, `Week${week}`);
          await setDoc(weekDocRef, { week: `Week ${week}` });
        }
      }
  
      // Create a Vendors collection at the same level as the Year collection
      const vendorsCollectionRef = collection(userRef, "Vendors");
      // You can add an initial empty document to ensure the collection is created
      await addDoc(vendorsCollectionRef, { createdAt: new Date() });
  
      console.log("Documents and Vendors collection created successfully!");
      navigate('/login');
    } catch (e) {
      console.error("Error creating documents:", e);
    }
  };
  
  
  


 const getDataFromFirestore = () => {
  debugger
    const querySnapshot = getDocs(collection(firebaseDb, "restaurants"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
})
 };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const validatePassword = (password, confirmPassword) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter.');
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
    }
  };



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!!passwordError}
              onClick={onSubmit}
            >
              Sign Up
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!!passwordError}
              onClick={getDataFromFirestore}
            >
              Get
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
