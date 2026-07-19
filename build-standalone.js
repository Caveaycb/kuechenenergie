"use strict";

const fs = require("fs");

const styles = fs.readFileSync("styles.css", "utf8");

function bundlePage(sourceFile, outputFile, replacements = []) {
  const source = fs.readFileSync(sourceFile, "utf8");
  let bundled = source.replace(
    '<link rel="stylesheet" href="styles.css" />',
    `<style>\n${styles}\n</style>`
  );

  if (fs.existsSync("eins-energie-logo.svg")) {
    const logo = fs.readFileSync("eins-energie-logo.svg");
    bundled = bundled.replace(
      'src="eins-energie-logo.svg"',
      `src="data:image/svg+xml;base64,${logo.toString("base64")}"`
    );
  }

  replacements.forEach(([from, to]) => {
    bundled = bundled.replaceAll(from, to);
  });

  bundled = bundled.replace(/<script src="([^"]+)"><\/script>/g, (tag, file) => {
    const script = fs.readFileSync(file, "utf8").replace(/<\/script/gi, "<\\/script");
    return `<script>\n${script}\n</script>`;
  });

  bundled = bundled.replace(
    "<head>",
    '<head>\n    <meta name="generator" content="Küchenenergie Standalone-Build" />'
  );

  fs.writeFileSync(outputFile, bundled);
  console.log(`${outputFile} erstellt (${Math.round(Buffer.byteLength(bundled) / 1024)} KB)`);
}

bundlePage("index.html", "Kuechenenergie.html", [
  ['href="wochenplaene.html"', 'href="Kuechenenergie-Wochenplaene.html"']
]);

bundlePage("wochenplaene.html", "Kuechenenergie-Wochenplaene.html", [
  ['href="index.html"', 'href="Kuechenenergie.html"'],
  ['href="index.html#menu-planner"', 'href="Kuechenenergie.html#menu-planner"']
]);
