# Work Hours Tracker

A modern, responsive Django web application for tracking work hours and managing job packages. Built with best practices in mind, featuring a clean UI, accessibility support, and comprehensive functionality.

## ✨ Features

### Core Functionality

- **Time Tracking**: Start and stop jobs with precise timestamps
- **Job Packages**: Organize related work into packages for better project management
- **Duration Calculation**: Automatic calculation of work duration
- **Real-time Updates**: AJAX-powered interface for seamless user experience

### User Experience

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Modern UI**: Clean, professional interface with smooth animations
- **Quick Actions**: Start jobs quickly with minimal form fields

### Technical Features

- **Django Best Practices**: Class-based views, proper model design, and form validation
- **Database Optimization**: Efficient queries with select_related and proper indexing
- **Security**: CSRF protection, input validation, and secure form handling
- **Admin Interface**: Comprehensive admin panel with custom displays and filters

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd work-hours-tracker
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the database**

   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (optional)**

   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**

   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Main application: http://localhost:8000
   - Admin interface: http://localhost:8000/admin

## 📱 Usage

### Starting a Job

1. Navigate to the dashboard
2. Use the "Quick Start" form in the sidebar to begin a new job
3. Optionally assign the job to a package
4. Click "Start Job" to begin tracking

### Managing Job Packages

1. Click "New Package" to create a job package
2. Give your package a descriptive name
3. Assign jobs to packages when creating or editing them

### Viewing and Editing Jobs

- View all jobs in the main dashboard table
- Click on job titles to view detailed information
- Use the "Edit" button to modify job details
- Use the "Stop" button to end active jobs

## 🏗️ Project Structure

```
work-hours-tracker/
├── work-hours-tracker/          # Main project directory
│   ├── ManageTime/              # Main Django app
│   │   ├── models.py            # Database models
│   │   ├── views.py             # View logic
│   │   ├── forms.py             # Form definitions
│   │   ├── urls.py              # URL routing
│   │   ├── admin.py             # Admin interface
│   │   └── apps.py              # App configuration
│   ├── SubmitWorkHours/         # Project settings
│   │   ├── settings.py          # Django settings
│   │   └── urls.py              # Main URL configuration
│   └── static/                  # Static files
│       ├── css/                 # Stylesheets
│       ├── js/                  # JavaScript files
│       └── templates/           # HTML templates
├── requirements.txt             # Python dependencies
└── README.md                   # This file
```

## 🎨 Design System

The application uses a modern design system with:

- **Color Palette**: Professional blue and gray tones
- **Typography**: Inter font family for excellent readability
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design with breakpoints at 768px and 480px

## 🔧 Development

### Code Quality

The project follows Python and Django best practices:

- **PEP 8**: Python code style guidelines
- **Django Conventions**: Following Django's recommended patterns
- **Type Hints**: Where applicable for better code documentation
- **Documentation**: Comprehensive docstrings and comments

### Testing

```bash
# Run tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Code Formatting

```bash
# Format code with Black
black .

# Sort imports with isort
isort .

# Lint with flake8
flake8 .
```

## 🚀 Deployment

### Production Settings

For production deployment, consider:

1. Setting `DEBUG = False` in settings
2. Configuring a production database (PostgreSQL recommended)
3. Setting up static file serving with WhiteNoise or a CDN
4. Using environment variables for sensitive settings
5. Setting up proper logging

### Environment Variables

Create a `.env` file for local development:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Django framework for the excellent web framework
- Inter font family for beautiful typography
- Modern CSS techniques for responsive design
- Accessibility guidelines (WCAG 2.1) for inclusive design

## 📞 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy time tracking!** ⏰
