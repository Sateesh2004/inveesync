import React from 'react';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="flex space-x-4">
          <Link href="/">
            <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</span>
          </Link>
          <Link href="/management">
            <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Management</span>
          </Link>
        </div>
        
      </div>
    </nav>
  );
};

export default NavBar;
