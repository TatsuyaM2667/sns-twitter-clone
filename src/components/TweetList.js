import React from 'react';
import TweetItem from './TweetItem';

const TweetList = ({ tweets, user, onLike, onReply, repliesMap, likedMap, onDelete, onImpression, theme }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {tweets.map((tweet, idx) => (
      <TweetItem
        key={tweet.id || idx}
        tweet={tweet}
        user={user}
        onLike={onLike}
        onReply={onReply}
        replies={repliesMap?.[tweet.id] || []}
        liked={likedMap?.[tweet.id] || false}
        onDelete={onDelete}
        onImpression={onImpression}
        theme={theme}
      />
    ))}
  </ul>
);

export default TweetList; 