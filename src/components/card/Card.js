import React from 'react';
import './Card.css';

export default function Card({ word }) {
  return (
    <div className="spy-card">
      <div className="spy-card-content">
        {word}
      </div>
    </div>
  );
}
