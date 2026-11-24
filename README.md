# My_vides

A short Arabic motion-graphics video made with Remotion. The source video is stored in the repository root, and `render.sh` copies it into Remotion's `public/` folder before rendering.

## Customize

Edit `src/config.json` to change the title, subtitle, channel name, call to action, and timed captions. The captions' `from` and `to` values are seconds.

## Render

Install Node.js, then run:

```bash
npm install
bash render.sh
```

The rendered MP4 is saved under `out/`. The composition is 1080×1920 at 30 fps and 30 seconds long.
