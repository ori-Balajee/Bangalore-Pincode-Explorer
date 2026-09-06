const express = require('express');
const cors = require('cors');
const pincodeRoutes = require('./routes/pincodeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pincode', pincodeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server running on the Port')
});

