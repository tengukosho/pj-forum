#!/bin/bash
set -e

echo "🎨 Building VOZ-Style School Forum Frontend..."

# Create directory structure
mkdir -p src/{api,components/{layout,thread,common},contexts,pages/{Home,Login,Register,Thread,CreateThread,Category,Profile},styles,utils}

echo "✅ Directory structure created"
