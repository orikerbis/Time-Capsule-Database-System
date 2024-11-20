**Time-Capsule-Database-System-(TCDS)**

DBMS project using relational database model.<br />
Documentation included (Software Engineering)<br />


Overview

The Time Capsule Database System (TCDS) is a full-stack application designed for securely storing and retrieving digital memories, messages, and documents at a specified future date. Users can create, encrypt, and manage time capsules containing files and text, add shared users, and securely release the capsules on their scheduled date.



Features

   -- User Authentication: Login and registration with secure credentials.<br />
   -- Capsule Creation: Upload PNG, JPG, or GIF files, add descriptions, and set a future release date and time.<br />
   -- Encryption: AES-256 encryption for secure content storage.<br />
   -- Shared Access: Add up to 3 shared users per capsule for controlled access.<br />
   -- Capsule Release: Capsules remain sealed until the specified date and are accessible only to authorized users.<br />
   -- Audit Logs: Tracks user actions for monitoring and debugging.<br />



Tech Stack

Frontend<br />
 -- Framework: Next.js<br />
 -- UI Libraries: Material-UI, Tailwind CSS<br />
 -- Language: TypeScript<br />
 -- Design Tools: Canva<br />

Backend<br />
 -- Framework: Node.js<br />
 -- API Development: Express.js<br />
 -- Authentication: JWT (JSON Web Token)<br />
 -- Encryption: AES-256<br />

Database<br />
 -- Relational Database: MySQL<br />
 -- Management Tools: SQL Workbench<br />

    

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

Usage:<br />
   -- Register or log in to create a new user account.<br />
   -- Create a time capsule by uploading content, adding shared users, and setting a release date.<br />
   -- View or download released capsules after their scheduled date.<br />



Use Cases:

1. User Registration and Login<br />
    Actor: User<br />
    Description: A user registers by providing an email and password. They log in using these credentials to access the dashboard where they can manage their time capsules.<br />
    Goal: Secure authentication and access to the user’s dashboard.<br />
   
2. Create a Time Capsule<br />
    Actor: User<br />
    Description: The user uploads content (image files like PNG, JPG, or GIF), adds a description, and sets a future release date for the capsule.<br />
    Goal: Securely store and encrypt the user’s digital content for future access.<br />
   
3. Add Shared Users<br />
    Actor: User<br />
    Description: The user can add up to 3 shared users to their time capsule. These users will have access to the capsule once the release date is reached.<br />
    Goal: Control access to time capsules by specifying shared users.<br />
   
4. Capsule Retrieval<br />
    Actor: User, Shared User<br />
    Description: On the specified release date, the user or any authorized shared users can access and view the capsule’s content.<br />
    Goal: Ensure content is securely released only to the authorized users after the set date.<br />

5. Audit and Action Logging<br />
    Actor: Admin<br />
    Description: The system logs all user actions, including capsule creation, sharing, and retrieval, to track system activity and potential issues.<br />
    Goal: Provide administrators with a detailed audit log of user interactions for monitoring and troubleshooting.<br />



Future Enhancements:<br />
 -- Notification system to alert users upon capsule release.<br />
 -- Support for additional file types (e.g., videos and audio).<br />
 -- Multilingual user interface for global accessibility.<br />
