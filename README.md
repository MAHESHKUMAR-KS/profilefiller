# AI Resume Parser - Auto Profile Filler

A modern web application that leverages AI to parse resumes and automatically fill profile forms. This application uses Google's Gemini AI to extract structured data from resumes in PDF or DOCX format.

## 🚀 Features

- **AI-Powered Resume Parsing**: Uses Google Gemini AI to extract structured data from resumes
- **Multi-Format Support**: Accepts both PDF and DOCX resume files
- **Smart Form Filling**: Automatically populates profile fields with extracted data
- **OCR Support**: Handles scanned PDFs using Tesseract.js
- **Modern UI**: Beautiful, responsive interface with visual feedback
- **Real-time Validation**: Shows which fields are auto-filled, manually filled, or need review

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based UI framework
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Modern JavaScript**: ES6+ features for clean, maintainable code

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Multer**: Middleware for handling file uploads
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX to text conversion
- **Tesseract.js**: OCR for scanned documents
- **pdf-poppler**: PDF to image conversion for OCR

### AI & Processing
- **Google Generative AI (Gemini)**: AI model for resume parsing
- **Structured Data Extraction**: Converts unstructured resume text to structured JSON

## 📋 Data Fields Handled

The application extracts and displays the following information:

- **Personal Information**: Full name, email, phone number
- **Professional Details**: Skills, experience, education
- **Projects**: Personal and professional projects
- **Certifications**: Professional certifications
- **Achievements**: Awards and accomplishments
- **Areas of Interest**: Professional interests

## 🏗️ Project Structure

```
profilefiller/
├── autoprofilefiller/          # Frontend React application
│   ├── src/
│   │   └── components/
│   │       └── ResumeUpload.jsx  # Main component with enhanced UI
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Node.js server
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
├── README.md
└── package.json
```

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MAHESHKUMAR-KS/profilefiller.git
   cd profilefiller
   ```

2. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   cd autoprofilefiller
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `server/` directory:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the application**:
   - **Backend**: `cd server && node server.js`
   - **Frontend**: `cd autoprofilefiller && npm run dev`

## 🤖 How It Works

1. **File Upload**: User uploads a resume in PDF or DOCX format
2. **Text Extraction**: 
   - For PDF: Uses `pdf-parse` library
   - For DOCX: Uses `mammoth` library
   - For scanned PDFs: Uses OCR via Tesseract.js and pdf-poppler
3. **AI Processing**: Sends extracted text to Google Gemini AI
4. **Structured Output**: AI returns structured JSON with resume data
5. **Form Population**: Frontend displays extracted data in organized fields
6. **Visual Feedback**: Shows which fields were auto-filled vs. need review

## 🎨 UI/UX Highlights

- **Modern Glass-Morphism Design**: Beautiful gradient backgrounds with backdrop blur
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Status Indicators**: Visual cues for auto-filled, filled, and needs-review fields
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Visual Feedback**: Loading states, success indicators, and error messages
- **Custom Scrollbars**: Enhanced UI with gradient-styled scrollbars

## 🔧 API Endpoints

- `POST /api/resume/parse`: Parse uploaded resume file
  - Accepts multipart/form-data with "resume" field
  - Returns JSON with success status and profile data

## 📁 Sample Resume Format

The application works best with resumes containing:
- Contact information (name, email, phone)
- Professional summary or objective
- Work experience with company names, positions, dates
- Education with institutions, degrees, dates
- Skills and technical proficiencies
- Projects and achievements
- Certifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Use Cases

- **Job Applications**: Quickly fill out multiple job applications
- **Profile Updates**: Update professional profiles across platforms
- **ATS Optimization**: Format resume data for Applicant Tracking Systems
- **Portfolio Creation**: Generate portfolio content from resume data

## 🔮 Future Enhancements

- Integration with LinkedIn and other professional networks
- Export functionality for different formats (JSON, XML, CSV)
- Advanced formatting options for different application types
- Multi-language support
- Resume scoring and recommendations