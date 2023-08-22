const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");

router.get("/player", async (req, res) => {
  const playerLink = req.query;

  try {
    const { data } = await axios.get(
      "https://www.transfermarkt.co.za/cristiano-ronaldo/profil/spieler/8198"
    );

    const $ = cheerio.load(data);

    const playerName = $("strong").text();
    const shirtNumber = $(".data-header__shirt-number").text().trim();
    const playerImage = $(".data-header__profile-image").attr("src");

    const achievements = [];
    $(".data-header__badge-container a").each(function () {
      const title = $(this).attr("title");
      const link = "https://www.transfermarkt.co.za" + $(this).attr("href");
      const img = $(this).find("img").attr("src");
      const count = $(this).find(".data-header__success-number").text().trim();
      achievements.push({ title, link, img, count });
    });

    const clubLogoLinks = $(".data-header__box__club-link img")
      .attr("srcset")
      .split(",")
      .map((src) => src.trim().split(" ")[0]);
    const clubName = $(".data-header__club").text().trim();
    const clubLink =
      "https://www.transfermarkt.co.za" +
      $(".data-header__club a").attr("href");
    const leagueLogo = $(".data-header__league-link img").attr("src");
    const leagueName = $(".data-header__league-link").text().trim();
    const leagueLink =
      "https://www.transfermarkt.co.za" +
      $(".data-header__league-link").attr("href");
    const dateOfBirth = $(
      '.data-header__label:contains("Date of birth/Age") .data-header__content'
    )
      .text()
      .trim();
    const nationality = $(
      '.data-header__label:contains("Citizenship") .data-header__content'
    )
      .text()
      .trim();
    const position = $(
      '.data-header__label:contains("Position") .data-header__content'
    )
      .text()
      .trim();
    const agent = $('.data-header__label:contains("Agent") a').text().trim();
    const agentLink =
      "https://www.transfermarkt.co.za" +
      $('.data-header__label:contains("Agent") a').attr("href");
    const marketValue = $(".data-header__market-value-wrapper").text().trim();

    res.json({
      playerName,
      shirtNumber,
      playerImage,
      achievements,
      clubLogoLinks,
      clubName,
      clubLink,
      leagueLogo,
      leagueName,
      leagueLink,
      dateOfBirth,
      nationality,
      position,
      agent,
      agentLink,
      marketValue,
    });
  } catch (error) {
    res.status(500).send("Error occurred");
  }
});

module.exports = router;
