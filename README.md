# TO-DO-APP
Stay organized and boost your productivity with this beautifully designed To-Do App! Featuring a modern dark purple theme, smooth animations, and interactive hover effects, this app makes managing your daily tasks both efficient and enjoyable.
# 📝 Animated To-Do App

A beautiful, feature-rich to-do application with dark purple theme, smooth animations, and modern UI design. Built with vanilla HTML, CSS, and JavaScript.

![To-Do App Preview](https://img.shields.io/badgeio/badge/CSS3-1572B6?logo=css3&logoColor=whiteshields.io/badge/JavaScript-F7DF1E?logo=javascript&logo

- **🌙 Dark/Light Theme Toggle** - Switch between stunning dark purple and clean light themes
- **🎨 Smooth Animations** - Beautiful transitions, hover effects, and interactive feedback
- **💾 Local Storage** - Automatically saves your tasks in browser storage
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **⌨️ Keyboard Support** - Press Enter to quickly add new tasks
- **🎯 Task Management** - Add, complete, delete, and track your tasks effortlessly
- **✨ Modern UI** - Glass morphism effects, shadows, and elegant styling
- **🔄 Real-time Updates** - Live task counter and progress tracking

## 🚀 Demo

Open `index.html` in your browser to see the app in action!

## 📁 Project Structure

```
todo-app/
│
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🛠️ Installation

1. **Clone or Download** this repository
   ```bash
   git clone https://github.com/yourusername/animated-todo-app.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd animated-todo-app
   ```

3. **Open the app**
   - Double-click on `index.html`, or
   - Right-click → "Open with" → Your preferred browser, or
   - Use a local server (recommended for development)

## 💻 Usage

### Adding Tasks
- Type your task in the input field
- Click the "Add" button or press **Enter**
- Watch your task slide in with a smooth animation

### Managing Tasks
- **Complete**: Click the checkbox to mark tasks as done
- **Delete**: Hover over a task and click the "Delete" button
- **Clear All**: Use the "Clear All" button to remove all tasks at once

### Theme Switching
- Click the 🌙/☀️ button in the top-right corner to toggle between themes
- Your theme preference is automatically saved

## 🎨 Customization

### Colors
The app uses CSS custom properties (variables) for easy customization:

```css
:root {
    --accent-primary: #48bb78;    /* Primary accent color */
    --danger: #e53e3e;            /* Delete button color */
    --text-primary: #2d3748;      /* Main text color */
    /* ... more variables */
}
```

### Animations
Modify animation durations and effects in the CSS:

```css
.task-item {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🌟 Key Technologies

- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced styling, animations, and responsive design
- **Vanilla JavaScript** - ES6+ features and modern JavaScript
- **Local Storage API** - Client-side data persistence
- **CSS Custom Properties** - Dynamic theming system

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎯 Performance Features

- **Hardware Acceleration** - Uses `transform` and `opacity` for smooth animations
- **Efficient Rendering** - `will-change` properties for optimized performance
- **Minimal JavaScript** - Lightweight vanilla JS implementation
- **CSS Animations** - GPU-accelerated transitions

## 🔧 Development

### Local Development
For the best development experience, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### File Structure Details

- **`index.html`** - Contains the app structure and semantic HTML
- **`style.css`** - All styling, animations, and responsive design
- **`script.js`** - Task management logic and theme switching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern task management applications
- CSS animations inspired by contemporary web design trends
- Color palette designed for accessibility and visual appeal

## 📞 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Portfolio**: [yourportfolio.com](https://yourportfolio.com)

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ and lots of ☕
