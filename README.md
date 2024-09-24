# Dealoye

![Dealoye Logo](public/images/DealOye(5).png) <!-- Replace with actual logo image if available -->

**Dealoye** is a web application designed for college students to facilitate the exchange of goods and requirements within their community. Users can post their requirements, sell items, and browse various listings, making college life easier and more connected.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Sign up and log in using email and OTP verification.
- **Marketplace**: Post items for sale and browse available listings.
- **Requirements Board**: Users can post their requirements and connect with others.
- **Dashboard**: Manage wishlist, sold items, and posted requirements.
- **Admin Panel**: Admin features to manage listings and user accounts.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Templating Engine**: Handlebars
- **Authentication**: Passport.js
- **Deployment**: Vercel

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/dealoye.git
cd deploy
npm install 
```

## Usage
To run the application in development mode, use:
```bash
npm run dev
```
This will start the server on http://localhost:3000.

## Environment Variables
Create a .env file in the root directory and add the following variables:
```bash
MONGO_URI=your_mongodb_connection_string
SECRET=your_secret_key
```

## Deployment
The application is deployed on Vercel. You can go ahead and access it here.

Push your updates to the main branch to deploy changes, and Vercel will automatically redeploy the application.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
### Customization

- Replace placeholders like `your username`, `your_mongodb_connection_string`, and `your-vercel-deployment-url` with actual values.
- If you have a logo or any other images, you can link them in the README.
- Add any additional sections you think might be useful, such as FAQs or known issues.

Feel free to adjust any wording or sections as per your project's needs! Let me know if you need further modifications.
