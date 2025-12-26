import React from 'react';
import ProfileEdit from '../components/ProfileEdit';

const ProfileEditPage = ({ user, profile, onProfileUpdated, theme }) => (
  <div style={{ maxWidth: 480, margin: '40px auto', background: theme === 'dark' ? '#23272f' : '#fff', borderRadius: 12, boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)', padding: 32 }}>
    <h2 style={{ textAlign: 'center', color: theme === 'dark' ? '#e3f2fd' : '#1976d2' }}>プロフィール設定</h2>
    <ProfileEdit user={user} profile={profile} onProfileUpdated={onProfileUpdated} />
  </div>
);

export default ProfileEditPage;