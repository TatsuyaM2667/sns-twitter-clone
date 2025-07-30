import React from 'react';

const DMUserList = ({ users, currentUser, onSelect, selectedUid }) => (
  <div style={{ borderRight: '1px solid #eee', minWidth: 180, maxWidth: 240, height: '100%', overflowY: 'auto' }}>
    <h3 style={{ padding: '12px 16px', margin: 0, borderBottom: '1px solid #eee', fontSize: 16 }}>ユーザー一覧</h3>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {users.filter(u => u.uid !== currentUser?.uid).map(u => (
        <li
          key={u.uid}
          onClick={() => onSelect(u)}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            background: selectedUid === u.uid ? '#e3f2fd' : 'none',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {u.photoURL && <img src={u.photoURL} alt="icon" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 10 }} />}
          <span>{u.displayName || u.email}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default DMUserList;