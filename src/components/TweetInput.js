import React, { useState } from 'react';

const CLOUD_NAME = 'demo'; // サンプル値
const UPLOAD_PRESET = 'ml_default'; // サンプル値

const TweetInput = ({ onTweet }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.secure_url;
    }
    onTweet(text, imageUrl);
    setText('');
    setImage(null);
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