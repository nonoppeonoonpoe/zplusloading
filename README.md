# Z-City+ loading screen

Loading screen for Polo's Server, served by GitHub Pages and used through `sv_loadingurl`.

## Backgrounds

Put background images in the `bg/` folder, named by number:

```
bg/1.jpg
bg/2.jpg
bg/3.jpg
```

The page finds them by itself and crossfades between them every 12 seconds (`zcBgSeconds` in `index.html`). Numbers have to go up without gaps, since it stops looking at the first missing one. Only `.jpg` is picked up. Around 1920 to 2560 pixels wide keeps loading fast.

## Server config

```
sv_loadingurl "https://<your pages url>/"
```

## Easter egg

Click the spinning Z. Click it 5 times quickly for the rainbow and snake.
