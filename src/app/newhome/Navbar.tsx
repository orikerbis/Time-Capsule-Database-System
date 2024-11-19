import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import aboutImage from "../../../public/assets/logo.png"; // Adjust path if necessary
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side: Website Name and Logo */}
        <div className="navbar-left">
          <Link href="/" className="navbar-brand">TimeLock</Link>
          <div className="navbar-logo">
            <Image src={aboutImage} alt="Logo" width={40} height={40} />
          </div>
        </div>

        {/* Right side: Navigation Links */}
        <div className="navbar-right">
            <Link href="/newhome/createCapsuleForm">Create</Link>
            <Link href="/newhome/dashboardPage">Dashboard</Link>
            <Link href="/newhome/history">History</Link>
            <Link href="/newhome/profile">Profile</Link>          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
