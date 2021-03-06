const extractScssVariables = scss => {
  const variableRe = /((\w|-)+): \$(\w+),/g;
  const match = {};
  let haveResult = true;

  while (haveResult) {
    const result = variableRe.exec(scss);

    if (result == null || result.length < 1) {
      haveResult = false;
    } else {
      const emojiName = result[1];
      const colorName = result[3];
      const re = new RegExp(`\\$${colorName}\\s?: (#.{6});`, 'g');
      const [, color] = re.exec(scss);

      match[emojiName] = color;
    }
  }

  return match;
};

const getGitmojis = async () => {
  try {
    const res = await fetch(process.env.GITMOJI_URL);
    if (!res.ok) throw new Error('Error fetching emojis');

    const { gitmojis } = await res.json();
    return gitmojis;
  } catch (err) {
    throw new Error('An error ocured while fetching the emojis from the web');
  }
};

const getColors = async () => {
  try {
    const res = await fetch(process.env.GITMOJI_COLORS_URL);
    if (!res.ok) throw new Error('Error fetching emojis');

    const scss = await res.text();
    const variables = extractScssVariables(scss);
    return variables;
  } catch (err) {
    throw new Error(
      'An error occured while fetching emoji colors from the web',
    );
  }
};

const getEmojis = async () => {
  const [gitmojis, colors] = await Promise.all([getGitmojis(), getColors()]);

  const emojis = gitmojis.map(e => ({
    ...e,
    color: colors[e.name],
    filterKey: `${e.emoji} ${e.code} ${e.description}`,
  }));

  return emojis;
};

export { getEmojis };
