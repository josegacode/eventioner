const retrieveRolePermissions = role => {
  return role;
}

const getRoleByName = (guild, role) => {
  return guild.roles.cache.find(guildRole => {
    guildRole.name == role;
  })
}

module.exports = {
  getRoleByName: getRoleByName
}
