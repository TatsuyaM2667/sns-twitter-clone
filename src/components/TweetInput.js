import React, { useState } from 'react';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const TweetInput = ({ onTweet }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    setUploading(true);
    let imageUrl = '';
    try {
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
      if (res.ok) {
        imageUrl = data.secure_url;
      } else {
        throw new Error(data.error.message || '画像のアップロードに失敗しました');
      }
      }
      onTweet(text, imageUrl);
      setText('');
      setImage(null);
    } catch (error) {
      console.error("Tweet submission error:", error);
      alert(error.message);
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: 16, alignItems: 'center', gap: 8 }}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="いまどうしてる？"
        style={{ flex: 1, padding: 8 }}
        required
      />
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
      <button type="submit" style={{ marginLeft: 8 }} disabled={uploading}>
        {uploading ? '投稿中...' : 'ツイート'}
      </button>
    </form>
  );
};

export default TweetInput; 