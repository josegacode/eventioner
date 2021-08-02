const express = require('express');
const router = express.Router();
const { client } = require('../../index');

// define the home page route
router.get('/', (req, res) => {
	const guild = client.guilds.cache.find(guild => {
		return guild.id === process.env.MAIN_SERVER_ID;
	})

	res
		.status(200)
		.json(guild);
});

module.exports = router;
