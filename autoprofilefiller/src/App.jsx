import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ResumeUpload from './components/ResumeUpload'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ResumeUpload />
      </div>
    </div>
  )
}

export default App
