import React from 'react'
import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';
import { words } from '../../data/words';
import Form from '../../components/form/Form';
import './Home.css';
import { getLocalUsedWords } from '../../utils';
export default function Home() {
  function clearLocal() {
    localStorage.removeItem('usedWords');
    window.location.reload();
  }
  return (
    <div style={{backgroundColor:"black"}} >
      <h1 style={{ textAlign: "center",color:"white" }}>Spy production təqdimmm edirrr....</h1>
      {getLocalUsedWords()?.length > 0 &&<h2 onClick={clearLocal} style={{ textAlign: "center", color: "white", cursor:"pointer" }}>İstifadə olunan: {getLocalUsedWords()?.length} söz var, click edərək oyunu təmizlə <br /> Açılmayan söz sayı: {words?.length - getLocalUsedWords()?.length}</h2>}
      <div className='home'>
        <Form />
      </div>
    </div>
  )
}
