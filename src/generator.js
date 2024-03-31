const baseUrl = "https://www.asahi-net.or.jp/~cs8k-cyu/";
const listFileName = "./src/abagames_games.csv";
const outputDirectory = "./docs/";
const pageFileNames = {
  all: "index.html",
  windows: "windows.html",
  one_button: "one_button.html",
  browser: "browser.html",
  flash: "flash.html",
  misc: "misc.html",
};
const summaryImageFileNames = {
  all: "all.png",
  windows: "windows.png",
  one_button: "one_button.png",
  browser: "browser.png",
  flash: "flash.png",
  misc: "misc.png",
};
const pageNames = {
  all: "All",
  windows: "Windows",
  one_button: "One button",
  browser: "Browser",
  flash: "Flash",
  misc: "Misc.",
};
const LinkTypeNames = {
  detail: "Detail",
  play: "Play",
};
const platformNames = {
  windows: "Windows",
  one_button: "One button",
  browser: "Browser",
  flash: "Flash",
  misc: "Misc.",
  wonder_witch: "WonderWitch",
  piece: "P/ECE",
  palm: "Palm",
  java: "Java",
  pc_98: "PC-9801",
  petitcom: "Petitcom",
  unity: "Unity",
  i_appli: "iAppli",
  pocket_cosmo: "PocketCosmo",
  ruputer: "Ruputer",
  zaurus: "Zaurus",
  pc_60: "PC-6001",
};

/** @type { {title: string, imageUrl: string, linkUrl: string, linkType: string, platformName: string}[]} */
let gameList;

loadList();
savePage("all");
savePage("windows");
savePage("one_button");
savePage("browser");
savePage("flash");
savePage("misc");

function loadList() {
  const fs = require("fs");
  const listCsv = fs.readFileSync(listFileName, "utf8");
  const list = listCsv.split("\r\n");
  list.shift();
  list.pop();
  gameList = list.map((l) => {
    const items = l.split(",");
    return {
      title: items[0],
      imageUrl: items[1],
      linkUrl: items[2],
      linkType: items[3],
      platformName: items[4],
    };
  });
}

/**
 * @param {"all" | "windows" | "one_button" | "browser" | "flash" | "misc" } type
 */
function savePage(type) {
  const fileName = `${outputDirectory}${pageFileNames[type]}`;
  const fs = require("fs");
  const pageHtml = getPage(type);
  fs.writeFileSync(fileName, pageHtml);
}

/**
 * @param {"all" | "windows" | "one_button" | "browser" | "flash" | "misc" } type
 * @return { {title: string, imageUrl: string, linkUrl: string, linkType: string, platformName: string}[] }
 */
function filterGameList(type) {
  if (type === "all") {
    return gameList;
  }
  if (
    type === "windows" ||
    type === "one_button" ||
    type === "browser" ||
    type === "flash"
  ) {
    return gameList.filter((g) => g.platformName === type);
  }
  if (type === "misc") {
    return gameList.filter(
      (g) =>
        g.platformName !== "windows" &&
        g.platformName !== "one_button" &&
        g.platformName !== "browser" &&
        g.platformName !== "flash"
    );
  }
}

/**
 * @param {{title: string, imageUrl: string, linkUrl: string, linkType: string, platformName: string}[]} list
 * @return {string}
 */
function getCards(list) {
  return list
    .map((g) =>
      getCard(g.title, g.imageUrl, g.linkUrl, g.linkType, g.platformName)
    )
    .join("");
}

/**
 * @param {string} title
 * @param {string} imageUrl
 * @param {string} linkUrl
 * @param {string} linkType
 * @param {string} platformName
 * @return {string}
 */
function getCard(title, imageUrl, linkUrl, linkType, platformName) {
  const buttonHtml =
    linkUrl === "undefined"
      ? `
          <a
            href="${linkUrl}"
            class="btn btn-secondary disabled my-2"
            >No Detail</a
          >
      `
      : `
          <a
            href="${linkUrl}"
            class="btn btn-primary my-2"
            >${LinkTypeNames[linkType]}</a
          >
`;
  const imgHtml =
    imageUrl === "undefined"
      ? `
<svg
  class="bd-placeholder-img card-img-top"
  width="100%"
  height="225"
  xmlns="https://www.w3.org/2000/svg"
  role="img"
  aria-label="Placeholder: Thumbnail"
  preserveAspectRatio="xMidYMid slice"
  focusable="false"
>
  <title>Placeholder</title>
  <rect width="100%" height="100%" fill="#55595c"></rect>
  <text x="50%" y="50%" fill="#eceeef" dy=".3em">
    No image
  </text>
</svg>
`
      : `
<img
  src="${imageUrl}"
  alt="${title}"
  class="bd-placeholder-img card-img-top"
  height="225"
  style="object-fit: contain"
  loading="lazy"
/>
`;
  return `
<div class="col">
  <div class="card shadow-sm">
    ${imgHtml}
    <div class="card-body">
      <p class="card-text">${title}</p>
      <div
        class="d-flex justify-content-between align-items-center"
      >
        <div class="btn-group">
          ${buttonHtml}
        </div>
        <small class="text-muted">${platformNames[platformName]}</small>
      </div>
    </div>
  </div>
</div>
`;
}

/**
 * @param {"all" | "windows" | "one_button" | "browser" | "flash" | "misc" } type
 * @return {string}
 */
function getPage(type) {
  const cardHtml = getCards(filterGameList(type));
  let title = "ABA Games";
  if (type != "all") {
    title += ` - ${pageNames[type]}`;
  }
  let buttons = ["all", "windows", "one_button", "browser", "flash", "misc"]
    .map((t) => {
      if (t === type) {
        return `
<a href="#" class="btn btn-secondary my-2 disabled">${pageNames[t]}</a>
`;
      } else {
        return `
<a href="${baseUrl}${pageFileNames[t]}" 
class="btn btn-primary my-2">${pageNames[t]}</a>
`;
      }
    })
    .join("");
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="ABA Games" />
    <meta name="twitter:description" content="${pageNames[type]} games" />
    <meta name="twitter:image" content="${baseUrl}${summaryImageFileNames[type]}" />
    <title>${title}</title>
    <link href="favicon.png" rel="icon" />

    <link
      href="./bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
      crossorigin="anonymous"
    />
    <link href="./dark_mode.css" rel="stylesheet" />

    <meta name="theme-color" content="#7952b3" />

    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a
            href="https://www.asahi-net.or.jp/~cs8k-cyu/"
            class="navbar-brand d-flex align-items-center"
          >
            <strong>ABA Games</strong>
          </a>
        </div>
      </div>
    </header>

    <main>
      <section class="py-3 text-center container">
        <div class="row py-lg-3">
          <div class="col-lg-6 col-md-8 mx-auto">
            <p class="lead text-muted">
              GitHub:
              <a href="https://github.com/abagames">abagames</a>
              Twitter:
              <a href="https://twitter.com/abagames">@abagames</a>
            </p>
            <h1 class="fw-light">${pageNames[type]} games</h1>
            <p>
              ${buttons}
            </p>
          </div>
        </div>
      </section>

      <div class="album py-5 bg-light">
        <div class="container">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          ${cardHtml}
          </div>
        </div>
      </div>
    </main>
  </body>
</html>
`;
}
