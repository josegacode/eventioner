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
		.json(guild.members.cache);
});

// Returns roles of certain user
// todo: check for non id provided
router.get('/:id/roles', (req, res) => {
	const guild = client.guilds.cache.find(guild => {
		return guild.id === process.env.MAIN_SERVER_ID;
	})

	const member = guild.members.cache
		.find(member => member.id === req.params.id);

	res.json(member.roles.cache);
});

module.exports = router;
