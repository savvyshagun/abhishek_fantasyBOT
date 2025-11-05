#!/bin/sh

echo "🚀 Starting Fantasy Cricket Bot & Mini App..."

# Start nginx in background
echo "📱 Starting Mini App (nginx on port 3019)..."
nginx &

# Start backend bot
echo "🤖 Starting Backend Bot (port 3000)..."
exec node src/index.js
