import React from 'react';
import './Card.css';

export default function Card({ word, relatedWords, isSpy, mode }) {
  let displayContent = word;
  if (mode === 'relatedWords' && isSpy && Array.isArray(relatedWords) && relatedWords.length > 0) {
    // Show 2 random related words for spy
    const shuffled = [...relatedWords].sort(() => Math.random() - 0.5);
    displayContent = shuffled.slice(0, 2).join(' / ');
  }
  return (
    <div className="spy-card">
      <div className="spy-card-content">
        {displayContent}
      </div>
    </div>
  );
}
