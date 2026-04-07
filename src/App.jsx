import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TeamDirectory from './components/TeamDirectory'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TeamDirectory />} />
        <Route path="/leadership/:memberName" element={<TeamDirectory />} />
        <Route path="/technology/:memberName" element={<TeamDirectory />} />
        <Route path="/revenue-operations/:memberName" element={<TeamDirectory />} />
        <Route path="/sde-1/:memberName" element={<TeamDirectory />} />
        <Route path="/software-development-engineer/:memberName" element={<TeamDirectory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App