import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div style={styles.card}>
      <h2>{user.name}</h2>
      <p><strong>Roll Number:</strong> {user.rollNumber}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '300px',
    margin: '0 auto',
    textAlign: 'center',
  },
};

export default UserCard;
