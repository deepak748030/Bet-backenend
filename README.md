

# Betting Application

A web-based betting application that allows users to register, log in, and participate in betting activities. Built with Node.js, Express.js, and MongoDB, the application provides a secure and efficient platform for managing users and transactions.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Detailed File Descriptions](#detailed-file-descriptions)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Technologies Used

- **Node.js**: JavaScript runtime for executing server-side code.
- **Express.js**: Framework for building web applications and APIs.
- **MongoDB**: NoSQL database for storing user and transaction data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **JWT (JSON Web Token)**: Used for secure authentication.
- **Docker**: Containerization tool for easy deployment.

---

## Project Structure

```
/project-root
│
├── .dockerignore                       # Files and folders to ignore in Docker builds.
├── .env                                # Environment variables for configuration.
├── .gitignore                          # Files to ignore in git version control.
├── Dockerfile                           # Instructions to build a Docker image.
├── folder_structure.txt                # Document listing the folder structure.
├── index.js                            # Entry point for the application.
├── package.json                         # Project metadata and dependencies.
├── package-lock.json                   # Locked versions of dependencies.
├── README.md                           # Documentation for the project.
├── vercel.json                         # Configuration for Vercel deployment.
│
├── bookie                               # Main folder for the betting application logic.
│   ├── mxcontrollers                   # Controllers handling requests.
│   ├── mxmodels                         # Data models used in the application.
│   ├── mxroute                          # API route definitions.
│   ├── config                           # Configuration files.
│   ├── controllers                      # Business logic for the application.
│   ├── models                           # Data models for the application.
│   ├── routes                           # API route definitions.
│   └── utils                            # Utility functions used throughout the application.
│       
└── package.json                         # Project dependencies and scripts.
```

---

## Detailed File Descriptions

### 1. Root Directory Files

- **.dockerignore**: Specifies files and folders to be excluded when building the Docker image.
- **.env**: Contains sensitive environment variables (e.g., database URI, JWT secret).
- **.gitignore**: Specifies files to be ignored by Git.
- **Dockerfile**: Instructions for creating a Docker image of the application.
- **folder_structure.txt**: A textual representation of the folder structure.
- **index.js**: The main entry point where the server is initialized and started.
- **package.json**: Lists project dependencies, scripts, and metadata.
- **package-lock.json**: Ensures consistent installs of dependencies.
- **README.md**: Documentation providing an overview and instructions for the project.
- **vercel.json**: Configuration file for deploying the application on Vercel.

### 2. Bookie Folder

The `bookie` folder contains the core application logic, including controllers, models, routes, and utilities.

#### mxcontrollers

Controllers that handle incoming requests:

- **bookieController.js**: Manages general bookie operations.
- **localMatchController.js**: Handles local match-related requests.
- **localMatchScoreCardController.js**: Manages scorecard details for local matches.
- **localSquadController.js**: Handles local squad operations.
- **mxCricketMatchController.js**: Manages cricket match-related requests.
- **mxSpotController.js**: Handles betting spots and related data.
- **mxTransactionController.js**: Manages transactions (deposits, withdrawals).
- **mxUserController.js**: Manages user operations (registration, login).

#### mxmodels

Mongoose models representing the application's data structures:

- **localMatchScoreCard.js**: Schema for local match scorecards.
- **localSquadModel.js**: Schema for local squad data.
- **mxBookieSpot.js**: Schema for betting spots.
- **mxCricketMatchModel.js**: Schema for cricket match data.
- **mxLocalMatchesModel.js**: Schema for local matches.
- **mxSpotModel.js**: Schema for betting spots.
- **mxTransactionModels.js**: Schema for transaction data.
- **mxUserModel.js**: Schema for user data.

#### mxroute

API route definitions:

- **bookieRoute.js**: Routes for bookie-related operations.
- **localMatchRoute.js**: Routes for local match operations.
- **mxCricketMatchRoute.js**: Routes for cricket match operations.
- **mxSpotRoutes.js**: Routes for managing betting spots.
- **mxTransactionRoute.js**: Routes for handling transactions.
- **mxUserRoutes.js**: Routes for user management.

### 3. Config Folder

- **db.js**: Contains the configuration and logic to connect to the MongoDB database using Mongoose.

### 4. Controllers

Business logic for the application:

- **bannerController.js**: Manages banner-related operations.
- **matchController.js**: Handles match-related operations.
- **matchFinish.js**: Logic for finishing matches.
- **matchLiveController.js**: Manages live match operations.
- **spotController.js**: Handles betting spot-related operations.
- **squadController.js**: Manages squad-related operations.
- **transactionControllers.js**: Handles transaction-related requests.
- **userControllers.js**: Manages user-related requests.

### 5. Models

Data structures for the application:

- **bannerModel.js**: Represents banner data.
- **cricketMatchModel.js**: Represents cricket match data.
- **matchModels.js**: Represents general match data.
- **scorecardModel.js**: Represents scorecard data.
- **spotModels.js**: Represents betting spot data.
- **transcationModels.js**: Represents transaction data.
- **userModels.js**: Represents user data.

### 6. Routes

API endpoints and their corresponding controllers:

- **bannerRoutes.js**: Routes for managing banners.
- **liveMatchRoutes.js**: Routes for managing live matches.
- **matchRoutes.js**: Routes for general match operations.
- **transactionRoutes.js**: Routes for transaction management.
- **userRoutes.js**: Routes for user management.

### 7. Utils

- **apiUtils.js**: Utility functions for API responses and error handling.

---

## Usage

1. **Installation**: Clone the repository and navigate into the project directory. Run the following command to install the dependencies:
   ```bash
   npm install
   ```

2. **Configuration**: Create a `.env` file in the root directory and define the necessary environment variables, such as database URI and JWT secret.

3. **Run the Application**: Start the server using:
   ```bash
   node index.js
   ```
   Or use Docker:
   ```bash
   docker build -t betting-app .
   docker run -p 3000:3000 betting-app
   ```

4. **Testing**: Use Postman or a similar tool to interact with the API endpoints as defined in the routes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. 

---

## Contact

For inquiries, feel free to reach out:

- **Name**: Deepak Kushwah
- **Email**: deepakkushwah748930@gmail.com
- **GitHub**:[https://github.com/deepak748030](https://github.com/deepak748030)
