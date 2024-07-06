import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import './Form.css';
export default function Form() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Number 1: ${number1}, Number 2: ${number2}`);
  };
  return (
    <form className="form">
      <div className="form-group">
        <label htmlFor="number1">Oyunçu sayı</label>
        <input
          type="number"
          id="number1"
          min={0}
          value={number1}
          onChange={(e) => setNumber1(e.target.value)}
          placeholder="İştirak edəcək oyunçu sayını daxil edin..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="number2">Spy sayı</label>
        <input
          type="number"
          id="number2"
          min={0}
          value={number2}
          onChange={(e) => setNumber2(e.target.value)}
          placeholder="Oyunda olacaq spy sayını daxil edin..."
        />
      </div>
      <Link className='button' to={`/game/${number1 || 0}/${number2 || 0}`}>Oyuna başla</Link>
    </form>
  )
}
