const express = require('express');
const cors = require('cors')
const IRISEL = express();
const port = 8000;



IRISEL.listen(port, () => {console.log('Server is running on localhost:8000')})