const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.use(errorHandler);


app.get('/', (req, res) => {
    res.send(`
        <center>
            <h1>Welcome to the EXPENSE_CONTROLLER_TOOL!</h1>
            <br>
            <p>
                Get EXPENSE_CONTROLLER_TOOL: 
            <a href="https://github.com/RonakPatel2468/EXPENSE_CONTROLLER_TOOL.git" target="_blank">Repository:EXPENSE_CONTROLLER </a>
            </p>
        </center>
    `);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
