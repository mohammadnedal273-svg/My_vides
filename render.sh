#!/usr/bin/env bash
set -euo pipefail

mkdir -p public out

# The source clip is stored at the repository root; Remotion serves media from public/.
shopt -s nullglob
media=( *.mp4 *.mov *.webm )
if ((${#media[@]} == 0)); then
  echo "No .mp4, .mov, or .webm source video found in the repository root." >&2
  exit 1
fi
cp -f "${media[@]}" public/

node -e "const fs=require('fs');const clips=fs.readdirSync('public').filter(f=>/\\.(mp4|mov|webm)$/i.test(f)).sort();if(!clips.length)throw Error('No video clips found in public/');fs.writeFileSync('src/clips.json',JSON.stringify(clips,null,2)+'\\n')"

npx remotion render src/index.ts MyVideo "out/final-$(date +%H%M%S).mp4"
