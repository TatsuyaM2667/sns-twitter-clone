import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET; 

const ProfileEdit = ({ user, profile, onProfileUpdated }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [coverURL, setCoverURL] = useState(profile?.coverURL || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setPhotoURL(data.secure_url);
    } catch (err) {
      setError('画像のアップロードに失敗しました');
    }
    setUploading(false);
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCoverURL(data.secure_url);
      } else {
        throw new Error(data.error.message || 'カバー画像のアップロードに失敗しました');
      }
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL,
        coverURL,
        bio,
        email: user.email,
      });
      if (onProfileUpdated) onProfileUpdated({ displayName, photoURL, coverURL, bio });
      navigate('/profile');
    } catch (err) {
      console.error("Firestore save error:", err);
      setError('保存に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSave} style={{ marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>プロフィール編集</h2>
      <div style={{ marginBottom: 8 }}>
        <label>ユーザー名：</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>アイコン画像：</label><br />
        {photoURL && <img src={photoURL} alt="icon" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />}
        <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>カバー画像：</label><br />
        {coverURL && <img src={coverURL} alt="cover" style={{ width: '100%', maxWidth: 320, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
        <input type="file" accept="image/*" onChange={handleCoverChange} disabled={uploading} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>自己紹介：</label><br />
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 8 }} disabled={uploading}>
        保存
      </button>
    </form>
  );
};

export default ProfileEdit; 