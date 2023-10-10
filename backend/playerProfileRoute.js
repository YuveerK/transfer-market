const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

router.get("/player", async (req, res) => {
  const playerLink = req.query;
  console.log(playerLink.playerLink);
  try {
    const { data } = await axios.get(
      `https://www.transfermarkt.co.za${playerLink.playerLink}`
    );

    const $ = cheerio.load(data);

    const achievements = [];
    $(".data-header__success-data").each((i, elem) => {
      achievements.push({
        imageUrl: $("img", elem).attr("src"),
        title: $("img", elem).attr("title"),
        alt: $("img", elem).attr("alt"),
        count: $(".data-header__success-number", elem).text(),
        link: $(elem).attr("href"),
      });
    });
    const performanceData = [];
    $(".tm-player-performance__performance-swiper-container").each((i, el) => {
      const title = $(el)
        .find('[data-testid="performance-headline-link"]')
        .text()
        .trim();
      const stats = [];
      $(el)
        .find(".tm-player-performance__stats-list-item")
        .each((i, statElement) => {
          const statDescription = $(statElement)
            .find('[data-testid="performance-slide-stat-item-term"]')
            .text()
            .trim();
          const statValue = $(statElement)
            .find('[data-testid="performance-item-link"]')
            .text()
            .trim();
          stats.push({ [statDescription]: statValue });
        });

      performanceData.push({
        title: title,
        stats: stats,
      });
    });
    const playerDetails = {
      name: $("strong").text(),
      shirtNumber: $(".data-header__shirt-number").text().trim(),
      captainBadge: {
        imageUrl: $(".data-header__headline-container img").attr("src"),
        alt: $(".data-header__headline-container img").attr("alt"),
        title: $(".data-header__headline-container img").attr("title"),
      },
      currentClub: {
        logoUrl: $(".data-header__box__club-link img")
          .attr("srcset")
          .split(",")[0]
          .trim(),
        name: $(".data-header__club a").text(),
        link: $(".data-header__club a").attr("href"),
      },
      profile: {
        imageUrl: $(".data-header__profile-image").attr("src"),
        title: $(".data-header__profile-image").attr("title"),
        alt: $(".data-header__profile-image").attr("alt"),
      },
      birthDetails: {
        dateOfBirth: $('[itemprop="birthDate"]').text().trim(),
        placeOfBirth: $('[itemprop="birthPlace"]').text().trim(),
        nationality: $('[itemprop="nationality"]').text().trim(),
        flagUrl: $('[itemprop="nationality"] img').attr("src"),
      },
      physicalAttributes: {
        height: $('[itemprop="height"]').text().trim(),
        position: $(
          '.data-header__label:contains("Position:") .data-header__content'
        )
          .text()
          .trim(),
      },

      internationalDetails: {
        currentTeam: $(
          '.data-header__label:contains("Current international:") .data-header__content a'
        )
          .text()
          .trim(),
        caps: $(
          '.data-header__label:contains("Caps/Goals:") .data-header__content--highlight'
        )
          .first()
          .text(),
        goals: $(
          '.data-header__label:contains("Caps/Goals:") .data-header__content--highlight'
        )
          .last()
          .text(),
      },
      marketValue: {
        value: $(".data-header__market-value-wrapper")
          .text()
          .split("\n")[0]
          .trim(),
        lastUpdate: $(".data-header__last-update").text().trim(),
      },
      achievements: achievements,
      performanceData: performanceData, // added this line
    };

    res.json(playerDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/players", async (req, res) => {
  const playerLink = req.query;
  console.log(playerLink.playerLink);
  try {
    const { data } = await axios.get(
      `https://www.transfermarkt.co.za${playerLink.playerLink}`
    );

    const $ = cheerio.load(data);

    const scrapedData = {
      fullName: $('span:contains("Full name:")').next().text().trim(),
      dateOfBirthLink: $('span:contains("Date of birth:")')
        .next()
        .find("a")
        .attr("href"),
      dateOfBirth: $('span:contains("Date of birth:")').next().text().trim(),
      placeOfBirth: {
        name: $('span:contains("Place of birth:")')
          .next()
          .find("span[title]")
          .text()
          .trim(),
        flagSrc: $('span:contains("Place of birth:")')
          .next()
          .find("img.flaggenrahmen")
          .attr("src"),
      },
      age: $('span:contains("Age:")').next().text().trim(),
      height: $('span:contains("Height:")').next().text().trim(),
      citizenship: {
        name: $('span:contains("Citizenship:")').next().text().trim(),
        flagSrc: $('span:contains("Citizenship:")')
          .next()
          .find("img.flaggenrahmen")
          .attr("src"),
      },
      position: $('span:contains("Position:")').next().text().trim(),
      foot: $('span:contains("Foot:")').next().text().trim(),
      playerAgent: {
        name: $('span:contains("Player agent:")')
          .next()
          .find("a")
          .first()
          .text()
          .trim(),
        link: $('span:contains("Player agent:")').next().find("a").attr("href"),
        verifiedIcon: $('span:contains("Player agent:")')
          .next()
          .find('img[alt="Verified"]')
          .attr("src"),
      },
      currentClub: {
        name: $('span:contains("Current club:")')
          .next()
          .find("a[title]")
          .text()
          .trim(),
        link: $('span:contains("Current club:")')
          .next()
          .find("a[title]")
          .attr("href"),
        logoSrcSet: $('span:contains("Current club:")')
          .next()
          .find("img")
          .attr("srcset"),
        logoSrc: $('span:contains("Current club:")')
          .next()
          .find("img")
          .attr("src"),
      },
      joined: $('span:contains("Joined:")').next().text().trim(),
      contractExpires: $('span:contains("Contract expires:")')
        .next()
        .text()
        .trim(),
      outfitter: $('span:contains("Outfitter:")').next().text().trim(),
      socialMedia: {
        twitter: {
          link: $('.socialmedia-icons a[title="Twitter"]').attr("href"),
          iconSrc: $('.socialmedia-icons a[title="Twitter"] img').attr("src"),
        },
        facebook: {
          link: $('.socialmedia-icons a[title="Facebook"]').attr("href"),
          iconSrc: $('.socialmedia-icons a[title="Facebook"] img').attr("src"),
        },
        instagram: {
          link: $('.socialmedia-icons a[title="Instagram"]').attr("href"),
          iconSrc: $('.socialmedia-icons a[title="Instagram"] img').attr("src"),
        },
        website: {
          link: $(".socialmedia-icons a:not([title])").attr("href"),
          iconSrc: $(".socialmedia-icons a:not([title]) img").attr("src"),
        },
      },
    };

    res.json(scrapedData);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
