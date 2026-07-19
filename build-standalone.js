"use strict";

const fs = require("fs");

const source = fs.readFileSync("index.html", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const logo = fs.readFileSync("eins-energie-logo.svg");
let bundled = source.replace(
  '<link rel="stylesheet" href="styles.css" />',
  `<style>\n${styles}\n</style>`
);

bundled = bundled.replace(
  'src="eins-energie-logo.svg"',
  `src="data:image/svg+xml;base64,${logo.toString("base64")}"`
);

bundled = bundled.replace(/<script src="([^"]+)"><\/script>/g, (tag, file) => {
  const script = fs.readFileSync(file, "utf8").replace(/<\/script/gi, "<\\/script");
  return `<script>\n${script}\n</script>`;
});

bundled = bundled.replace(
  "<head>",
  '<head>\n    <meta name="generator" content="Küchenenergie Standalone-Build" />'
);

fs.writeFileSync("Kuechenenergie.html", bundled);
console.log(`Kuechenenergie.html erstellt (${Math.round(Buffer.byteLength(bundled) / 1024)} KB)`);
