# RooMoo - Affordable Rooms, Flats, Houses, Hostels, and More!


## Welcome to RooMoo - Your Ultimate Destination for Affordable Living Spaces!

RooMoo is a MERN (MongoDB, Express.js, React.js, Node.js) technology-based platform dedicated to connecting students, employees, and property owners in Nanded city. Our mission is to make finding and listing affordable rooms and flats hassle-free, creating a win-win situation for both renters and property owners.

## Key Features

- **Affordable Housing:** RooMoo focuses on providing cost-effective living spaces to students and employees, ensuring quality accommodation without breaking the bank.

- **User-Friendly Interface:** Our website boasts an intuitive and easy-to-navigate design, making the process of searching for, listing, and managing properties a breeze.

- **Open Listing Platform:** RooMoo invites property owners to list their available spaces, creating a diverse range of options for potential renters.

- **MERN Technology:** Built on the robust MERN stack, RooMoo ensures a seamless and efficient user experience.

    - **MongoDB (M):** MongoDB is a NoSQL database that stores data in a flexible, JSON-like format. It provides scalability and high performance, making it an ideal choice for handling large amounts of property-related data.

    - **Express.js (E):** Express.js is a web application framework for Node.js that simplifies the process of building robust and scalable server-side applications. It enables the creation of RESTful APIs for seamless communication between the frontend and backend.

    - **React.js (R):** React.js is a JavaScript library for building user interfaces. With its component-based architecture, React allows for the creation of dynamic and interactive UIs, enhancing the user experience on RooMoo.

    - **Node.js (N):** Node.js is a runtime environment that executes JavaScript on the server side. It allows RooMoo to handle concurrent requests efficiently, providing a fast and responsive experience for users.

- **Render Hosting:** Leveraging render hosting for optimal performance and reliability, RooMoo guarantees a smooth browsing experience for users.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [MongoDB](https://www.mongodb.com/) account for database management

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/maheshshinde140/RooMoo-MERN.git
   ```

2. Navigate to the project directory:

   ```bash
   cd RooMoo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and add the necessary variables:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   ```

5. Run the application:

   ```bash
   npm start
   ```


## Contributing

We welcome contributions from the community! Whether you want to report a bug, suggest a feature, or submit a pull request, feel free to get involved. Check out our [contribution guidelines](CONTRIBUTING.md) for more information.

## Future Roadmap

RooMoo is currently focused on serving the Nanded city area. However, we have plans to expand to other cities in the future. Stay tuned for updates!

## Contact Us

Have questions, suggestions, or just want to say hi? Reach out to us at [info@roomoo.com](mailto:ermahesh140@gmail.com).

Thank you for choosing RooMoo! Happy house-hunting!

**Disclaimer:** RooMoo is a college project, and all listings are subject to availability and accuracy. Please verify details before making any decisions.











********************************************************  Deploy IN AWS *************************************************************


# Roomiii Project Setup

This README contains a **single script** to set up the Roomiii project on an Amazon Linux environment.  

> **Usage:** Copy all the code below into a file called `setup.sh` and run:  
> ```bash
> sudo bash setup.sh
> ```

```bash
#!/bin/bash

# ========================================================
# Roomiii Project Setup Script (All-in-One)
# ========================================================

echo "Starting Roomiii setup..."

# -------------------------
# 1. Install Node.js and PM2
# -------------------------
echo "Installing Node.js and PM2..."
sudo yum install -y nodejs
sudo npm install -g pm2 serve

# -------------------------
# 2. Install Project Dependencies
# -------------------------
echo "Installing backend dependencies..."
npm install mongoose dotenv cors cookie-parser express

# -------------------------
# 3. Install MongoDB
# -------------------------
echo "Setting up MongoDB repo..."
sudo bash -c 'cat > /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF'

echo "Installing MongoDB..."
sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# -------------------------
# 4. Configure Environment Variables
# -------------------------
echo "Setting up .env file..."
cd /root/Roomiii || { echo "Project directory not found!"; exit 1; }

cat > .env <<EOF
PORT=3000
MONGO=mongodb+srv://roomuser:Cloud%401234@cluster0.hh94cgv.mongodb.net/roomoo?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mySuperSecretKey
EOF

# -------------------------
# 5. Build the Client
# -------------------------
if [ -d "client" ]; then
    echo "Installing and building client..."
    cd client || exit
    npm install
    npm run build
    cd ..
else
    echo "Client directory not found. Skipping client build."
fi

# -------------------------
# 6. Start the Backend
# -------------------------
echo "Installing backend dependencies and starting server..."
npm install

# Optional: run in background using PM2
pm2 start index.js --name roomiii || npm start &

# -------------------------
# 7. Install Git LFS
# -------------------------
echo "Installing Git LFS..."
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.rpm.sh | sudo bash
sudo yum install -y git-lfs
git lfs pull

# -------------------------
# Done
# -------------------------
echo "Roomiii setup complete! Check your server on PORT=3000"
