import React from 'react';
import Student from './Student';
import Faculty from './Faculty';
import Admin from './Admin';

const UserDashboard = ({ user }) => {
  switch (user.role) {
    case 'student':
      return <Student user={user} />;
    case 'faculty':
      return <Faculty user={user} />;
    case 'admin':
      return <Admin user={user} />;
    default:
      return <p>Role not recognized</p>;
  }
};

export default UserDashboard;
