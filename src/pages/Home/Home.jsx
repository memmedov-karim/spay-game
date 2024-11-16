import React from 'react'
import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';
import Form from '../../components/form/Form';
import './Home.css';
export default function Home() {
  return (
    <div style={{backgroundColor:"black"}} >
      <h1 style={{ textAlign: "center",color:"white" }}>Spy production təqdimmm edirrr....</h1>
      <div className='home'>
        <Form />
      </div>
    </div>
  )
}
