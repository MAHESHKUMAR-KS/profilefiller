/**
 * Test script for the Resume Parser API
 * This script demonstrates how to use the /api/resume/parse endpoint
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Simple HTTP client using built-in modules
const http = require('http');
const https = require('https');

function uploadResume(filePath) {
  const form = new FormData();
  
  // Add the resume file to the form
  form.append('resume', fs.createReadStream(filePath));
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/parse',
    method: 'POST',
    headers: {
      ...form.getHeaders()
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response status code:', res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log('Response body:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        console.log('Raw response:', data);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('Error making request:', e);
  });
  
  // Pipe the form data to the request
  form.pipe(req);
}

// Check if a file path was provided as an argument
if (process.argv[2]) {
  const filePath = path.resolve(process.argv[2]);
  console.log(`Uploading resume: ${filePath}`);
  uploadResume(filePath);
} else {
  console.log('Usage: node test-api.js <path-to-resume-file>');
  console.log('Example: node test-api.js ./sample-resume.pdf');
}