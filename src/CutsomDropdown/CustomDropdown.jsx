import React, { useState, useEffect } from 'react';
import { 
  Autocomplete, 
  TextField, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { firebaseDb } from "../firabase";
import { collection, getDocs, addDoc } from "firebase/firestore";

function CustomDropdown({ onNameChange }) {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState('');

  useEffect(() => {
    fetchVendorsFromFirebase();
  }, []);

  const fetchVendorsFromFirebase = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in session storage');
      return;
    }

    try {
      const vendorsRef = collection(firebaseDb, "restaurants", userId, "Vendors");
      const querySnapshot = await getDocs(vendorsRef);
      const vendorNames = querySnapshot.docs.map(doc => doc.data().name).filter(Boolean);
      setOptions(vendorNames);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setOptions([]);
    }
  };

  const handleAddVendor = async () => {
    if (newVendor && !options.includes(newVendor)) {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in session storage');
        return;
      }

      try {
        const vendorsRef = collection(firebaseDb, "restaurants", userId, "Vendors");
        await addDoc(vendorsRef, { name: newVendor });
        
        console.log('Vendor added successfully to Firebase');
        
        // Refresh the vendor list
        await fetchVendorsFromFirebase();
        
        setSelectedValue(newVendor);
        onNameChange(newVendor);
        setNewVendor('');
        setDialogOpen(false);
      } catch (error) {
        console.error('Error adding vendor to Firebase:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Autocomplete
        options={options}
        renderInput={(params) => <TextField {...params} label="Select vendor" />}
        value={selectedValue}
        onChange={(event, newValue) => {
          setSelectedValue(newValue);
          onNameChange(newValue);
        }}
        sx={{ width: 300, mb: 1 }}
        noOptionsText="No vendors found"
      />
      <Button 
        onClick={() => setDialogOpen(true)}
        size="small"
        startIcon={<AddIcon />}
        sx={{ fontSize: '0.75rem' }}
      >
        Add new vendor
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vendor Name"
            fullWidth
            variant="outlined"
            value={newVendor}
            onChange={(e) => setNewVendor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVendor}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomDropdown;