#Time-Capsule-Database-System-(TCDS)

DBMS project using relational database model. 
Documentation included (Software Engineering)


Overview

The Time Capsule Database System (TCDS) is a full-stack application designed for securely storing and retrieving digital memories, messages, and documents at a specified future date. Users can create, encrypt, and manage time capsules containing files and text, add shared users, and securely release the capsules on their scheduled date.



Features

   -- User Authentication: Login and registration with secure credentials.
   -- Capsule Creation: Upload PNG, JPG, or GIF files, add descriptions, and set a future release date and time.
   -- Encryption: AES-256 encryption for secure content storage.
   -- Shared Access: Add up to 3 shared users per capsule for controlled access.
   -- Capsule Release: Capsules remain sealed until the specified date and are accessible only to authorized users.
   -- Audit Logs: Tracks user actions for monitoring and debugging.



Tech Stack

Frontend
 -- Framework: Next.js
 -- UI Libraries: Material-UI, Tailwind CSS
 -- Language: TypeScript
 -- Design Tools: Canva

Backend
 -- Framework: Node.js
 -- API Development: Express.js
 -- Authentication: JWT (JSON Web Token)
 -- Encryption: AES-256

Database
 -- Relational Database: MySQL
 -- Management Tools: SQL Workbench

    

Installation:

  Clone the repository:

    git clone https://github.com/Meeraja-K/Time-Capsule-Database-System.git

Navigate to the project directory:

    cd Time-Capsule-Database-System

Install dependencies:

    npm install

Configure environment variables:

    Create a .env file in the root directory.
    Add required database and JWT configuration.

Start the development server:

    npm run dev

Usage:
   -- Register or log in to create a new user account.
   -- Create a time capsule by uploading content, adding shared users, and setting a release date.
   -- View or download released capsules after their scheduled date.



Use Cases:

1. User Registration and Login
    Actor: User
    Description: A user registers by providing an email and password. They log in using these credentials to access the dashboard where they can manage their time capsules.
    Goal: Secure authentication and access to the user’s dashboard.
   
2. Create a Time Capsule
    Actor: User
    Description: The user uploads content (image files like PNG, JPG, or GIF), adds a description, and sets a future release date for the capsule.
    Goal: Securely store and encrypt the user’s digital content for future access.
   
3. Add Shared Users
    Actor: User
    Description: The user can add up to 3 shared users to their time capsule. These users will have access to the capsule once the release date is reached.
    Goal: Control access to time capsules by specifying shared users.
   
4. Capsule Retrieval
    Actor: User, Shared User
    Description: On the specified release date, the user or any authorized shared users can access and view the capsule’s content.
    Goal: Ensure content is securely released only to the authorized users after the set date.

5. Audit and Action Logging
    Actor: Admin
    Description: The system logs all user actions, including capsule creation, sharing, and retrieval, to track system activity and potential issues.
    Goal: Provide administrators with a detailed audit log of user interactions for monitoring and troubleshooting.



Future Enhancements:
 -- Notification system to alert users upon capsule release.
 -- Support for additional file types (e.g., videos and audio).
 -- Multilingual user interface for global accessibility.
