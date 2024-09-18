const express = require('express');
// const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const nodemailer = require("nodemailer");
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const UserDetails = require('./models/user');
const ProductDetails = require('./models/product');
const CartDetails = require('./models/cart');
const Wishlist = require('./models/wishlist');
const Requirement = require('./models/Requirement');
const productRoutes = require('../routes/index');
const featuredProductsRoute = require('../routes/featuredProducts');
const cartRoutes = require('../routes/cart');
const productRoute = require('../routes/product');
const sellRoutes = require('../routes/sell');
const WishlistRoutes = require('../routes/wishlist');
const ContactRoutes = require('../routes/contact');
const requirementsRoute = require('../routes/requirement');
const adminRoutes = require('../routes/adminRoutes');
const jwt = require("jsonwebtoken");


dotenv.config();
console.log('Users route path:', path.resolve(__dirname, './routes/users'));
const port = process.env.PORT || 3001;
const DB = process.env.MONGO_URI;

if (!DB) {
    console.error('Error: MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(DB).then(() => {
    console.log("Connection to MongoDB successful");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});

const app = express();
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

hbs.registerHelper('eq', function (a, b) {
    return a === b;
  });

app.use(express.static(static_path));
app.use(express.static(static_path, { 
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "hbs");
app.set("views", template_path);
// app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') }));
app.set('view engine', 'hbs');

app.use(session({
    secret: 'thisisdealoye', // Change this to a secure random key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://vidhigoyal619:qO7apOSxbnmT3SEI@cluster0.avt31no.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
    }),
    cookie: { secure: false } // Set to true if using HTTPS
}));

function isAdmin(req, res, next) {
    if (req.session.userRole === 'admin') {
        next(); // User is admin, allow access
    } else {
        res.status(403).send("Access denied. You must be an admin to access this page.");
    }
}

// --------------------------Metabase integration --------------------
var METABASE_SITE_URL = "http://localhost:3000";
var METABASE_SECRET_KEY = "df1eaea09f8b0fd37a36f1f33cddee5b38ceaf1be4d05b194cbfec5363c88f28";

var payload = {
  resource: { dashboard: 1 },
  params: {},
  exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
};
var token = jwt.sign(payload, METABASE_SECRET_KEY);

var iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

// ---------------------------routes------------------------------
app.use('/', productRoutes);
app.use("/",featuredProductsRoute);
app.use('/', cartRoutes);
app.use('/api', productRoute);
app.use('/', sellRoutes);
app.use('/', WishlistRoutes);
app.use('/', ContactRoutes);
app.use("/",requirementsRoute);
app.use('/api/admin', adminRoutes, isAdmin);

app.get('/', (req, res) => {
    res.render('index', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/index', (req, res) => {
    res.render('index', { isLoggedIn: req.session.isLoggedIn });
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("/services", (req, res) => {
    res.render("contact");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/otp", (req, res) => {
    res.render("otp");
});
app.get("/postad", (req, res)=>{
    res.render("postad");
});
app.get("/products", (req,res)=>{
    res.render("products");
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { isLoggedIn: req.session.isLoggedIn });
});
app.get("/cart", (req,res)=>{
    res.render("cart");
});
app.get("/wishlist", (req,res)=>{
    res.render("wishlist");
});
app.get("/requirements", (req,res)=>{
    res.render("requirements");
});
app.get("/buy", (req,res)=>{
    res.render("buy");
});
app.get("/sell", (req,res)=>{
    res.render("sell");
});
// app.get('/admin-dashboard', (req, res) => {
//     res.render('admin-dashboard', { isLoggedIn: req.session.isLoggedIn });
// });

app.get('/admin-dashboard', function(req, res) {
    // Pass the iframeUrl to the template
    res.render('admin-dashboard', { iframeUrl: iframeUrl });
  });
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: 'quoterandom4@gmail.com',
        pass: 'yglkxfxdfkuvjtey'
    },
});

// Function to send OTP email
async function sendOTPByEmail(email, otp) {
    try {
        const info = await transporter.sendMail({
            from: 'quoterandom4@gmail.com',
            to: email,
            subject: "OTP Verification",
            text: `Your OTP for verification is: ${otp}`,
            html: `<b>Your OTP for verification is: ${otp}</b>`,
        });

        console.log("Email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// Function to generate random OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
// Handle signup form submission
app.post("/signup", async (req, res) => {
    try {
        const { fullname, email, phone, password, role } = req.body; // Added 'role'

        // Check if role is provided, default to 'user' if not
        const userRole = role || 'user'; 

        // Generate OTP for email verification
        const otp = generateOTP();

        // Create a new user with the role
        const newUser = new UserDetails({ fullname, email, phone, password, role: userRole, otp });

        // Save the user details in the database
        await newUser.save();

        // Send OTP to the user's email
        await sendOTPByEmail(email, otp);

        // Redirect user to the OTP verification page
        res.redirect(`/otp?userId=${newUser._id}`);
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Verify OTP (compare with stored OTP)
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.render("otp", { error: "Invalid OTP" });
        }

        // Check if the entered OTP matches the stored OTP
        if (user.otp !== otp) {
            return res.render("otp", { error: "Invalid OTP" });
        }

        // Update user status to indicate email verification
        user.isEmailVerified = true;
        await user.save();

        // Set session variable
        req.session.isLoggedIn = true;
        req.session.userId = user._id;

        // Check the user's role and redirect accordingly
        if (user.role === 'admin') {
            return res.redirect("/admin-dashboard");
        } else {
            return res.redirect("/dashboard");
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).send("Internal Server Error");
    }
});
// Handle login form submission
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserDetails.findOne({ email });

        if (!user) {
            return res.render("login", { error: "Invalid email or password" });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.render("login", { error: "Invalid email or password" });
        }

        // Set session variables upon successful login
        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        req.session.userRole = user.role; // Save the user role in the session

        // Redirect based on user role
        if (user.role === 'admin') {
            return res.redirect('/admin-dashboard');
        } else {
            return res.redirect('/dashboard');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/postad', upload.array('images', 2), async (req, res) => {
    try {
        const { name, description, price, contact, condition, category, brand, color } = req.body;
        const imageFiles = req.files.map(file => file.path);
        const userId = req.session.userId; // Get the userId from the session

        if (!userId) {
            return res.status(401).send("Unauthorized: User is not logged in.");
        }

        const newProduct = new ProductDetails({
            name,
            description,
            price,
            contact,
            condition,
            category,
            brand,
            color,
            images: imageFiles,
            userId: userId // Pass the userId here
        });

        await newProduct.save();
        res.redirect('/buy');
    } catch (error) {
        console.error("Error posting ad:", error);
        res.status(500).send("Internal Server Error");
    }
});

// app.get('/api/products', async (req, res) => {
//     try {
//         const products = await ProductDetails.find({});
//         res.json(products); // Send the products as JSON
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


app.get('/api/products', async (req, res) => {
    try {
        const category = req.query.category || ''; // Get category from query string
        const searchQuery = req.query.query || ''; // Get search query from query string

        let filters = {};
        if (category && category !== 'Any') {
            filters.category = category;
        }
        if (searchQuery) {
            filters.name = { $regex: new RegExp(searchQuery, "i") };
        }

        const products = await ProductDetails.find(filters);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/api/featured-products', async (req, res) => {
    try {
        const featuredProducts = await ProductDetails.find({ featured: true });
        res.json(featuredProducts);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        
        const products = await ProductDetails.find({ 
            name: { $regex: new RegExp(query, "i") } 
        });

        if (products.length > 0) {
            res.render('index', { products });
        } else {
            res.render('index', { error: 'No products found. Please try searching again.' });
        }
    } catch (error) {
        console.error('Error during product search:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/requirements', async (req, res) => {
    try {
        const requirements = await Requirement.find().populate('user').sort({ createdAt: -1 });
        res.render('requirements', { requirements, isLoggedIn: req.session.isLoggedIn });
    } catch (error) {
        console.error('Error fetching requirements:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a new requirement
app.post('/add-requirements', async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.session.userId; // Assume user is logged in

        if (!userId) {
            return res.status(401).send("Unauthorized: User not logged in");
        }

        const newRequirement = new Requirement({
            title,
            description,
            user: userId
        });

        await newRequirement.save();
        res.redirect('/requirements');
    } catch (error) {
        console.error("Error adding requirement:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.get('/buy', async (req, res) => {
    try {
        const categories = await ProductDetails.distinct('category'); // Get all unique categories
        res.render('buy', { categories });
    } catch (error) {
        console.error("Error rendering buy page:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
