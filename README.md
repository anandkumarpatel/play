# Play

A collection of games including Connections, Solitaire, and more.

## Environment Setup

To run this project locally, you'll need to set up environment variables:

1. Create a `.env` file in the root directory
2. Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in your `.env` file

**Note:** Never commit your `.env` file to version control. It's already added to `.gitignore`.

## Development

```bash
npm install
npm run dev
```

# TODO

- logs
- service workers
- play notifications
- admin site
