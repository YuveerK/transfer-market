const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const playerProfileRoute = require("./playerProfileRoute");
const app = express();
const PORT = 2000;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.50.24:3000",
    "http://192.168.50.24:2000",
    "http://localhost:2000",
    "http://169.1.238.73:2000",
    "http://169.1.238.73:3000",
    "http://169.1.238.73",
  ],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.get("/team", async (req, res) => {
  const searchTerm = req.query.query;
  const page = req.query.page || 1;

  if (!searchTerm) {
    return res.send(
      "Please provide a search query with the 'query' parameter."
    );
  }

  const baseTargetUrl = `https://www.transfermarkt.co.za/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(
    searchTerm
  )}`;
  const TARGET_URL =
    page > 1
      ? `${baseTargetUrl}&page=${page}&Verein_page=${page}`
      : baseTargetUrl;

  try {
    const response = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract clubs information
    const targetH2 = $(
      "h2.content-box-headline:contains('Search results: Clubs')"
    );
    const targetTable = targetH2.next(".responsive-table").find("table.items");

    let clubs = [];
    targetTable.find("tbody tr").each((i, row) => {
      let clubData = {};
      // Club Image
      const clubImage = $(row).find("td.suche-vereinswappen img").attr("src");
      if (clubImage) {
        clubData["Club Image"] = clubImage.replace("/small/", "/header/");
      } else {
        clubData["Club Image"] = null; // or you can set a default image URL if you want
      }

      // Club
      const clubCell = $(row).find("td.hauptlink");
      clubData["Club"] = clubCell.find("a").text().trim();
      clubData["Link"] =
        "https://www.transfermarkt.co.za" + clubCell.find("a").attr("href");

      // League
      clubData["League"] = clubCell.parent().next().find("td a").text().trim();

      // Country
      clubData["Country"] = $(row).find("img.flaggenrahmen").attr("title");

      // Squad
      clubData["Squad"] = $(row).find("a[title^='Squad']").text().trim();

      // Total Market Value
      clubData["Total Market Value"] = $(row).find("td.rechts").text().trim();

      // Transfers
      clubData["Transfers"] =
        "https://www.transfermarkt.co.za" +
        $(row).find("a[title^='Transfers']").attr("href");

      // Stadium
      clubData["Stadium"] =
        "https://www.transfermarkt.co.za" +
        $(row).find("a[title^='Stadium']").attr("href");

      if (
        clubData["Squad"] !== "" &&
        clubData["Stadium"] !== "https://www.transfermarkt.co.zaundefined" &&
        clubData["Total Market Value"] !== "" &&
        clubData["Transfers"] !== "https://www.transfermarkt.co.zaundefined"
      ) {
        clubs.push(clubData);
      }
    });

    // Extract total pages
    const lastPageElement = $(
      ".tm-pagination__list-item--icon-last-page a.tm-pagination__link"
    );
    const lastPageTitle = lastPageElement.attr("title");

    let totalPages = 1; // Default to 1 page if no pagination found

    if (lastPageTitle) {
      const pageMatch = lastPageTitle.match(/page (\d+)/);
      if (!pageMatch || pageMatch.length !== 2) {
        return res.send(
          "Failed to extract total pages from the pagination element."
        );
      }
      totalPages = parseInt(pageMatch[1], 10);
    }

    let pagination = [];
    for (let i = 1; i <= totalPages; i++) {
      pagination.push({
        href: `${baseTargetUrl}&page=${i}&Verein_page=${i}`,
        title: `Page ${i}`,
      });
    }

    res.send({
      clubs: clubs,
      pagination: pagination,
    });
  } catch (error) {
    res.send("Error occurred: " + error.message);
  }
});

app.get("/scrape-league-table", async (req, res) => {
  const TARGET_URL =
    "https://www.transfermarkt.co.za/premier-league/tabelle/wettbewerb/GB1/saison_id/2023";

  try {
    const response = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const targetTable = $("table.items");

    let teams = [];

    targetTable.find("tbody tr").each((i, row) => {
      const columns = $(row).find("td");

      let teamData = {
        position: $(columns[0]).text().trim(),
        logo: $(columns[1])
          .find("img")
          .attr("src")
          .replace("/tiny/", "/header/"),
        name: $(columns[2]).find("a").text().trim(),
        played: $(columns[3]).text().trim(),
        wins: $(columns[4]).text().trim(),
        draws: $(columns[5]).text().trim(),
        losses: $(columns[6]).text().trim(),
        goals_for_against: $(columns[7]).text().trim(),
        goal_difference: $(columns[8]).text().trim(),
        points: $(columns[9]).text().trim(),
      };

      teams.push(teamData);
    });

    res.json({ success: true, data: teams });
  } catch (error) {
    res.json({ success: false, message: "Error occurred: " + error.message });
  }
});
function safeTrim(text) {
  return text ? text.trim() : "";
}
app.get("/scrape-team", async (req, res) => {
  const teamId = req.query.teamId;
  const club = req.query.club;
  const seasonId = req.query.seasonId;

  if (!teamId) {
    return res.status(400).send("Please provide a teamId query parameter.");
  }
  const newUrl = `https://www.transfermarkt.co.za/${club}/kader/verein/${teamId}/plus/1/galerie/0?saison_id=${seasonId}`;

  const URL = `https://www.transfermarkt.co.za/${club}/kader/verein/${teamId}/saison_id/${new Date().getFullYear()}/plus/1`;
  console.log(newUrl);
  try {
    const response = await axios.get(newUrl, {
      params: {
        teamId: teamId,
        club: club,
        seasonId: new Date().getFullYear(),
      },
    });

    const currentDate = new Date().getFullYear();
    const $ = cheerio.load(response.data);
    const targetTable = $("table.items");
    // res.send(targetTable.html());
    let players = [];
    let offset =
      seasonId.toString() === new Date().getFullYear().toString() ? 0 : 1;

    targetTable.find("tbody > tr").each(function (index, element) {
      let injuryDetail = $(element)
        .find(".hauptlink .verletzt-table.icons_sprite")
        .attr("title");
      const nationalities = $(element)
        .find("img.flaggenrahmen")
        .map(function () {
          return $(this).attr("title");
        })
        .get();

      const nationalityImages = $(element)
        .find("img.flaggenrahmen")
        .map(function () {
          return $(this).attr("src");
        })
        .get();
      const player = {
        number: $(element).find(".rn_nummer").text().trim(),
        image: $(element).find("img.bilderrahmen-fixed").attr("data-src"),
        signedFromImg: $(element)
          .find(`td.zentriert:nth-child(${8 + offset}) a > img`)
          .attr("src"),
        name: $(element).find(".hauptlink > a").text().trim(),
        injury: injuryDetail ? injuryDetail.trim() : "Not injured",
        playerProfileLink: $(element).find("tr td.hauptlink a").attr("href"),
        position: $(element)
          .find("table.inline-table > tbody > tr:last-child > td")
          .text()
          .trim(),
        dateOfBirth: $(element).find("td.zentriert:nth-child(3)").text().trim(),
        nationality: nationalities, // now it's an array
        nationalityImage: nationalityImages, // also an array
        height: $(element)
          .find(`td.zentriert:nth-child(${5 + offset})`)
          .text()
          .trim(),
        foot: $(element)
          .find(`td.zentriert:nth-child(${6 + offset})`)
          .text()
          .trim(),
        joined: $(element)
          .find(`td.zentriert:nth-child(${7 + offset})`)
          .text()
          .trim(),
        signedFrom: $(element)
          .find(`td.zentriert:nth-child(${8 + offset}) > a > img`)
          .attr("alt"),
        contractEnd: $(element)
          .find(`td.zentriert:nth-child(${9 + offset})`)
          .text()
          .trim(),
        marketValue: $(element).find("td.rechts.hauptlink").text().trim(),
      };

      if (player.number && player.number.trim() !== "") {
        players.push(player);
      }
    });
    let badgeImages = [];
    $(".data-header__badge-container a").each(function (index, aElement) {
      const imageUrl =
        $(aElement).find("img.data-header__success-image").attr("data-src") ||
        $(aElement).find("img.data-header__success-image").attr("src");
      const success = $(aElement)
        .find(".data-header__success-number")
        .text()
        .trim();
      const trophyName = $(aElement)
        .find("img.data-header__success-image")
        .attr("title");

      if (imageUrl && success) {
        badgeImages.push({ imageUrl, success, trophyName });
        console.log(success);
      }
    });

    const clubImageUrl = $(".data-header__profile-container img").attr("src");
    const squadSize = $(
      ".data-header__items .data-header__label:contains('Squad size:') .data-header__content"
    )
      .text()
      .trim();

    const averageAge = $(
      ".data-header__items .data-header__label:contains('Average age:') .data-header__content"
    )
      .text()
      .trim();

    const foreignersLink = $(
      ".data-header__items .data-header__label:contains('Foreigners:') .data-header__content a"
    ).attr("href");
    const foreigners = $(
      ".data-header__items .data-header__label:contains('Foreigners:') .data-header__content a"
    )
      .text()
      .trim();

    const percentageForeigners = $(
      ".data-header__items .data-header__label:contains('Foreigners:') .tabellenplatz"
    )
      .text()
      .trim();

    const nationalTeamPlayersLink = $(
      ".data-header__items .data-header__label:contains('National team players:') .data-header__content a"
    ).attr("href");
    const nationalTeamPlayers = $(
      ".data-header__items .data-header__label:contains('National team players:') .data-header__content a"
    )
      .text()
      .trim();

    const stadiumLink = $(
      ".data-header__items .data-header__label:contains('Stadium:') .data-header__content a"
    ).attr("href");
    const stadiumName = $(
      ".data-header__items .data-header__label:contains('Stadium:') .data-header__content a"
    )
      .text()
      .trim();

    const stadiumCapacity = $(
      ".data-header__items .data-header__label:contains('Stadium:') .tabellenplatz"
    )
      .text()
      .trim();

    const currentTransferRecordLink = $(
      ".data-header__items .data-header__label:contains('Current transfer record:') .data-header__content a"
    ).attr("href");
    const currentTransferRecord = $(
      ".data-header__items .data-header__label:contains('Current transfer record:') .data-header__content a"
    )
      .text()
      .trim();

    const leagueInfoBox = $(".data-header__box--big");
    const getSecondImageLink = (logoString) => {
      if (!logoString) {
        return null;
      }

      const matches = logoString.match(/https:\/\/[^\s]+ 2x/);
      return matches ? matches[0].replace(" 2x", "") : null;
    };

    let logoSrcSet = $(".data-header__box--big a img").attr("srcset");
    let logoImage = logoSrcSet ? logoSrcSet.trim() : null;

    const extractedLink = getSecondImageLink(logoImage);
    const leagueLink = leagueInfoBox
      .find("a.data-header__box__club-link")
      .attr("href");
    const leagueName = leagueInfoBox.find(".data-header__club a").text().trim();
    const leagueFlag = leagueInfoBox
      .find(".data-header__content img.flaggenrahmen")
      .attr("src");
    const leagueLevelLink = leagueInfoBox
      .find(".data-header__label strong + .data-header__content a")
      .attr("href");
    const leagueLevelName = leagueInfoBox
      .find(".data-header__label strong + .data-header__content a")
      .text()
      .trim();
    const tablePositionLink = leagueInfoBox
      .find(
        ".data-header__label:contains('Table position:') .data-header__content a"
      )
      .attr("href");
    const tablePosition = leagueInfoBox
      .find(
        ".data-header__label:contains('Table position:') .data-header__content a"
      )
      .text()
      .trim();
    const inLeagueSinceLink = leagueInfoBox
      .find(
        ".data-header__label:contains('In league since:') .data-header__content a"
      )
      .attr("href");
    const inLeagueSinceYears = leagueInfoBox
      .find(
        ".data-header__label:contains('In league since:') .data-header__content a"
      )
      .text()
      .trim();

    const marketValueBox = $(".data-header__box--small");

    const marketValueLink = marketValueBox
      .find(".data-header__market-value-wrapper")
      .attr("href");
    const marketValue = marketValueBox
      .find(".data-header__market-value-wrapper")
      .text()
      .split("\n")[0]
      .trim();
    const marketValueDescription = marketValueBox
      .find(".data-header__last-update")
      .text()
      .trim();

    const headlineContainer = $(".data-header__headline-container");
    const teamName = headlineContainer
      .find("h1.data-header__headline-wrapper")
      .text()
      .trim();

    const seasons = [];
    $('select[name="saison_id"] option').each((i, elem) => {
      seasons.push({
        value: $(elem).attr("value"),
        season: $(elem).text(),
      });
    });
    res.json({
      seasonOptions: seasons,
      teamName,
      marketValueLink,
      marketValue,
      marketValueDescription,
      logoImage,
      extractedLink,
      leagueName,
      leagueFlag,
      leagueLevelLink,
      leagueLevelName,
      tablePositionLink,
      tablePosition,
      inLeagueSinceLink,
      inLeagueSinceYears,
      squadSize,
      averageAge,
      foreigners,
      foreignersLink,
      percentageForeigners,
      nationalTeamPlayers,
      nationalTeamPlayersLink,
      stadiumName,
      stadiumLink,
      stadiumCapacity,
      currentTransferRecord,
      currentTransferRecordLink,
      players: (players = players.filter(
        (player, index, self) =>
          index === self.findIndex((p) => p.name === player.name)
      )),
      badgeImages,
      clubImageUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error: " + error.message);
  }
});

app.get("/scrape-transfer-filters", async (req, res) => {
  const {
    clubName,
    clubId,
    seasonId,
    position,
    detailedPosition,
    winterSummer,
  } = req.query;
  const URL = `https://www.transfermarkt.co.za/${clubName}/transfers/verein/${clubId}/plus/1?saison_id=${seasonId}&pos=${position}&detailpos=${detailedPosition}&w_s=${winterSummer}`;

  console.log(URL);
  // Set custom headers to mimic a real browser request.
  const axiosInstance = axios.create({
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    },
  });

  try {
    const response = await axiosInstance.get(URL);
    const html = response.data;

    const $ = cheerio.load(html);

    // For Seasons
    const seasons = [];
    $('select[name="saison_id"] option').each((i, elem) => {
      seasons.push({
        value: $(elem).attr("value"),
        season: $(elem).text(),
      });
    });

    const positions = [];
    $('select[name="pos"] option').each((i, elem) => {
      positions.push({
        value: $(elem).attr("value"),
        position: $(elem).text().trim(),
      });
    });

    // For Main positions
    const mainPositions = [];
    $('select[name="detailpos"] option').each((i, elem) => {
      mainPositions.push({
        value: $(elem).attr("value"),
        position: $(elem).text(),
      });
    });
    // For Transfer Date
    const transferDate = [];
    $('select[name="w_s"] option').each((i, elem) => {
      transferDate.push({
        value: $(elem).attr("value"),
        position: $(elem).text(),
      });
    });

    res.json({
      seasons: seasons,
      positions: positions,
      mainPositions: mainPositions,
      transferDate: transferDate,
    });
  } catch (error) {
    console.error(`Error fetching data from ${URL}:`, error.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.get("/scrape-transfers", async (req, res) => {
  const {
    clubName,
    clubId,
    seasonId,
    position,
    detailedPosition,
    winterSummer,
  } = req.query;
  const url = `https://www.transfermarkt.co.za/${clubName}/transfers/verein/${clubId}/plus/1?saison_id=${seasonId}&pos=${position}&detailpos=${detailedPosition}&w_s=${winterSummer}`;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const seasonYear = $("h2.content-box-headline:first-child").text().trim();

  const transferRecord = {
    income: {
      count: $(
        ".transfer-record__revenue .zentriert.test-class.transfer-record__text"
      )
        .text()
        .trim(),
      total: $(
        ".transfer-record__revenue .transfer-record__total.transfer-record__total--positive"
      )
        .text()
        .trim(),
    },
    expenditure: {
      count: $(".transfer-record__expenses .zentriert.transfer-record__text")
        .text()
        .trim(),
      total: $(
        ".transfer-record__expenses .transfer-record__total.transfer-record__total--negative"
      )
        .text()
        .trim(),
    },
    overallBalance: $(".redtext.rechts.transfer-record__total").text().trim(),
    allTransfersLink: $(".content-link").attr("href"),
  };
  const results = {
    season: seasonYear,
    transferRecord,
    arrivals: [],
    departures: [],
  };

  const isValidPlayer = (player) => player.name && player.position;

  $('.box:contains("Arrivals") .items tbody tr').each((i, row) => {
    const player = {
      name: $(row).find("td:nth-child(2) .hauptlink a").text().trim(),
      link: $(row).find("td:nth-child(2) .hauptlink a").attr("href"),
      position: $(row).find("td:nth-child(2) tr:last-child td").text().trim(),
      image: $(row).find("td:nth-child(2) img").attr("data-src"),
    };
    const age = $(row).find("td:nth-child(3)").text().trim();
    const marketValue = $(row).find("td:nth-child(4)").text().trim();
    const nationality = {
      flag: $(row).find("td:nth-child(5) img").attr("src"),
      name: $(row).find("td:nth-child(5) img").attr("title"),
    };
    const fromClub = {
      name: $(row).find("td:nth-child(6) .hauptlink a").text().trim(),
      link: $(row).find("td:nth-child(6) .hauptlink a").attr("href"),
      logo: $(row).find("td:nth-child(6) img.tiny_wappen").attr("src"),
    };
    const fee = {
      amount: $(row).find("td:nth-child(7) a").text().trim(),
      link: $(row).find("td:nth-child(7) a").attr("href"),
    };

    if (isValidPlayer(player)) {
      results.arrivals.push({
        player,
        age,
        marketValue,
        nationality,
        fromClub,
        fee,
      });
    }
  });

  $('.box:contains("Departures") .items tbody tr').each((i, row) => {
    const player = {
      name: $(row).find("td:nth-child(2) .hauptlink a").text().trim(),
      link: $(row).find("td:nth-child(2) .hauptlink a").attr("href"),
      position: $(row).find("td:nth-child(2) tr:last-child td").text().trim(),
      image: $(row).find("td:nth-child(2) img").attr("data-src"),
    };
    const age = $(row).find("td:nth-child(3)").text().trim();
    const marketValue = $(row).find("td:nth-child(4)").text().trim();
    const nationality = {
      flag: $(row).find("td:nth-child(5) img").attr("src"),
      name: $(row).find("td:nth-child(5) img").attr("title"),
    };
    const toClub = {
      name: $(row).find("td:nth-child(6) .hauptlink a").text().trim(),
      link: $(row).find("td:nth-child(6) .hauptlink a").attr("href"),
      logo: $(row).find("td:nth-child(6) img.tiny_wappen").attr("src"),
    };
    const fee = {
      amount: $(row).find("td:nth-child(7) a").text().trim(),
      link: $(row).find("td:nth-child(7) a").attr("href"),
    };

    if (isValidPlayer(player)) {
      results.departures.push({
        player,
        age,
        marketValue,
        nationality,
        toClub,
        fee,
      });
    }
  });

  res.json(results);
});

app.get("/scrape", async (req, res) => {
  const currentYear = new Date().getFullYear();
  let allResults = {};

  for (let year = 1992; year <= currentYear; year++) {
    let yearResults = {};

    for (let matchday = 1; matchday <= 42; matchday++) {
      try {
        const response = await axios.get(
          `https://www.transfermarkt.co.za/premier-league/spieltagtabelle/wettbewerb/GB1?saison_id=${year}&spieltag=${matchday}`
        );
        const html = response.data;
        const $ = cheerio.load(html);
        const teams = [];

        $(".items tbody tr").each((index, element) => {
          const rank = $(element).find(".rechts hauptlink").text().trim();
          const clubLogo = $(element)
            .find(".zentriert.no-border-rechts img")
            .attr("src");
          const clubName = $(element)
            .find(".no-border-links hauptlink a")
            .first()
            .text()
            .trim();
          const matches = $(element).find("td.zentriert").eq(0).text().trim();
          const wins = $(element).find("td.zentriert").eq(1).text().trim();
          const draws = $(element).find("td.zentriert").eq(2).text().trim();
          const losses = $(element).find("td.zentriert").eq(3).text().trim();
          const goals = $(element).find("td.zentriert").eq(4).text().trim();
          const diff = $(element).find("td.zentriert").eq(5).text().trim();
          const points = $(element).find("td.zentriert").eq(6).text().trim();

          teams.push({
            rank,
            clubLogo,
            clubName,
            matches,
            wins,
            draws,
            losses,
            goals,
            diff,
            points,
          });
        });

        yearResults[`matchday_${matchday}`] = teams;
      } catch (error) {
        console.log(
          `Failed to scrape data for year: ${year}, matchday: ${matchday}`
        );
      }
    }

    allResults[year] = yearResults;
  }

  res.json(allResults);
});

app.use(playerProfileRoute);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
