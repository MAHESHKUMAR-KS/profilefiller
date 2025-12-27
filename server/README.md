# Resume Parser API Server

A Node.js/Express server that provides an endpoint for parsing resumes in PDF and DOCX formats.

## Features

- Accepts resume files via multipart form data
- Validates file type (PDF/DOCX) and size (max 10MB)
- Temporarily stores uploaded files for processing
- Extracts text content from resumes
- Returns structured data about the resume

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Running the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on port 5000 by default.

### API Endpoint

#### POST /api/resume/parse

Upload and parse a resume file.

**Request:**
- Method: `POST`
- Endpoint: `/api/resume/parse`
- Content-Type: `multipart/form-data`
- Field name for file: `resume`
- Supported file types: PDF (.pdf), DOCX (.docx)
- Maximum file size: 10MB

**Example request using curl:**
```bash
curl -X POST \
  http://localhost:5000/api/resume/parse \
  -F "resume=@path/to/resume.pdf"
```

**Response:**

Success response (200):
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "fileName": "resume.pdf",
    "fileType": "PDF",
    "fileSize": 123456,
    "textContent": "Full text content of the resume...",
    "wordCount": 250,
    "pageCount": 2
  }
}
```

Error response (400, 500):
```json
{
  "success": false,
  "message": "Error message describing the issue",
  "error": "Optional error details"
}
```

## File Upload Validation

- **File Types**: Only PDF and DOCX files are accepted
- **File Size**: Maximum 10MB
- **Security**: Files are temporarily stored and deleted after processing

## Project Structure

```
server/
├── server.js          # Main server file with API endpoint
├── package.json       # Project dependencies and scripts
├── uploads/           # Temporary directory for uploaded files (created automatically)
└── README.md          # This file
```

## Dependencies

- `express`: Web framework for Node.js
- `multer`: Middleware for handling multipart/form-data (file uploads)
- `pdf-parse`: Library for parsing PDF files
- `mammoth`: Library for converting DOCX files to HTML/text