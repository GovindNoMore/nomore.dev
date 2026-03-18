const aboutMeText = `$ ./about_govind.sh
==INITIALIZING SYSTEM==
Loading user profile...

hi i'm Govind,
i'm a 17 year old, trying to get through life lmao.
i have so much love for things like eating, sleeping and music, and i also have a soft spot for dogs and memes.

Here are some fun facts about me:
- birthplace: Uttar Pradesh, India
- favorite bands: begum, the strokes, pcrc and so on
- i can play: the guitar, the piano and the drums (but not very well)
- currently: aspiring to be a cs major (lol)
- things i do when I'm free: sleep, eat and watch useless memes
- i rarely study but when i do i get good grades (not really but let's pretend)

==SYSTEM READY==
Welcome to my digital space.
`;

const typedText = document.getElementById('typed-text');
if (typedText) {
  let i = 0;
  let lock = false;

  const cursor = document.createElement('span');
  cursor.textContent = '_';
  cursor.style.cssText = 'animation:blink 1s step-end infinite;color:#27ca3f;';

  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);

  function type() {
    if (i < aboutMeText.length && !lock) {
      lock = true;
      typedText.textContent += aboutMeText[i];
      i++;
      setTimeout(() => { lock = false; type(); }, 22 + Math.random() * 18);
    } else if (i >= aboutMeText.length) {
      typedText.appendChild(cursor);
    }
  }

  setTimeout(type, 700);
}
