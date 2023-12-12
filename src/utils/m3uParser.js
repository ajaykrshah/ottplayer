const parseM3UData = (data) => {
    const lines = data.split('\n');
    const parsedStreams = [];
    let stream = null;
  
    lines.forEach((line) => {
      if (line.startsWith('#EXTINF:')) {
        const info = line.match(/#EXTINF:(-?\d+)(?:\s+tvg-chno="([^"]*)")?(?:\s+tvg-name="([^"]*)")?(?:\s+tvg-logo="([^"]*)")?(?:\s+tvg-language="([^"]*)")?(?:\s+tvg-type="([^"]*)")?(?:\s+group-title="([^"]*)")?.*,(.*)/);
  
        if (info && info.length >= 9) {
          const [, , tvgChno, , tvgLogo, tvgLanguage, tvgType, groupTitle, name] = info;
  
          const logoUrl = tvgLogo || '';
          const language = tvgLanguage || '';
          const type = tvgType || '';
          const group = groupTitle || '';
  
          // Create a new stream object for each entry
          stream = {
            tvgChno: parseInt(tvgChno),
            name,
            logo: logoUrl,
            language,
            type,
            group,
            url: '', // Initialize URL as empty for each stream
          };
        }
      } else if (line.trim() !== '' && !line.startsWith('#')) {
        // Set the URL for the current stream
        if (stream) {
          stream.url = line.trim();
          parsedStreams.push({ ...stream }); // Push a clone of the current stream object into parsedStreams
          stream = null; // Reset the stream object
        }
      }
    });
  
    return parsedStreams;
  };
  
  export default parseM3UData;
  