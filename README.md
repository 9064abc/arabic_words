# Arabic Words Test Website

アラビア語単語テストウェブサイト

A simple and interactive website to test your knowledge of Arabic words. Built with HTML, CSS, and JavaScript.

## Features

- 📝 Interactive multiple-choice questions
- 📊 Progress tracking
- 🎯 Detailed results with correct/incorrect answers
- 📱 Responsive design (works on mobile, tablet, and desktop)
- ⚡ Fast and lightweight
- 🎨 Beautiful UI with smooth animations

## How to Use

1. Click "Start Test" to begin
2. Read the Arabic word displayed
3. Select the correct meaning from the four options
4. Review your results at the end

## Local Development

1. Clone this repository
2. Open `index.html` in your web browser
3. No build tools or dependencies required!

```bash
git clone https://github.com/9064abc/arabic_words.git
cd arabic_words
# Open index.html in your browser or use a local server
python -m http.server 8000  # Python 3
# or
npx http-server  # Node.js
```

Then visit `http://localhost:8000` (or the port shown)

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and your site will be deployed!

### Option 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

Your site will be automatically deployed and you'll get a live URL!

## Project Structure

```
.
├── index.html      # Main HTML file
├── style.css       # Styling
├── script.js       # JavaScript functionality
├── words.json      # Arabic words database
└── README.md       # This file
```

## Adding More Words

Edit `words.json` to add more Arabic words:

```json
{
    "id": 21,
    "word": "كلمة جديدة",
    "meaning": "New Word",
    "transliteration": "Kalima Jadida"
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning purposes!

## Contributing

Feel free to fork this repository and submit pull requests to improve the website.

## Tips for Learning

- Take the test multiple times
- Write down words you find difficult
- Try to use the words in sentences
- Combine with audio resources for pronunciation practice

---

**Good luck with your Arabic learning! 🎉**
