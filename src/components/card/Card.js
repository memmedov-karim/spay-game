import React from 'react';
import './Card.css';
export default function Card({word}) {
  return (
    <div className="card">
      <div className="card-content">
        {word}
      </div>
    </div>
  )
}
