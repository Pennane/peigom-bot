const Discord = require('discord.js')
const CLIENT_CONFIG = require('../utilities/config')
const prefix = CLIENT_CONFIG.DISCORD.PREFIX

module.exports = ({ configuration, heading, body }) => {
  const embed = new Discord.MessageEmbed()
  embed.setColor('#FF0000')

  if (!configuration) throw new Error('No configuration to search syntax for.')
  if (!configuration.syntax) throw new Error('configuration did not include command syntax.')
  if (!configuration.name) throw new Error('configuration did not include a name for the commmand.')

  if (heading) {
    embed.title = heading
  } else {
    embed.title = `Komento ${configuration.name} toimii näin:`
  }

  if (body) {
    embed.description = body
  } else {
    embed.description = `\`${prefix}${configuration.syntax}\``
  }

  if (configuration.triggers.length > 1) {
    embed.addField(`Vaihtoehtoiset nimet`, configuration.triggers.join(' '))
  }

  return embed
}
