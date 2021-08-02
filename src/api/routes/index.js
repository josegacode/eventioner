const { Router } = require('express');
const router = new Router();

router.get('/', (request, response) => {
  response.render("index", { title: "Home" });
})

module.exports = router;
