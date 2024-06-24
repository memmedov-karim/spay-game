import React from 'react'
import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';
import Form from '../../components/form/Form';
import './Home.css';
export default function Home() {
  return (
    <>
    <h1 style={{textAlign:"center"}}>Oyun (Nicat,Xədicə,Aytən və Çələbi-nin şərəfinə hazırlanıb)</h1>
    <div className='home'>
      <Form />
    </div>
    </>
  )
}
