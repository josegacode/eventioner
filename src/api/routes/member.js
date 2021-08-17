const express = require('express');
const router = express.Router();
const { client } = require('../../index');

const getGuild = () => {
	const guild = client.guilds.cache.find(guild => {
		return guild.id === process.env.MAIN_SERVER_ID;
	});

	return guild;
}

// define the home page route
router.get('/', (req, res) => {
	res
		.status(200)
		.json(getGuild().members.cache);
});

// Returns roles of certain user
// todo: check for non id provided
router.get('/:id/roles', (req, res) => {
	const member = getGuild().members.cache
		.find(member => member.id === req.params.id);

	res.json(member.roles.cache);
});

module.exports = router;
