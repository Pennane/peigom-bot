const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);


const meta = {
    name: "tomb",
    admin: false,
    syntax: "tomb",
    desc: "Lähettää kanavalle tomb viestit.",
    triggers: ["tomb"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setTitle(`OLET TEHNYT TUHMUUKSIA!`)
            .setDescription('NYT RIITTAEAE VANDALISOINTI')
        msg.channel.send(embed)
            .then(msg => {
                setTimeout(function () {
                    embed.setDescription("NYT RIITTAEAE VANDALISOINTI\nTAEAE ON NYT TEIKAEN HAUTA");
                    msg.edit(embed)
                        .then(msg => {
                            setTimeout(function () {
                                embed.setDescription("NYT RIITTAEAE VANDALISOINTI\nTAEAE ON NYT TEIKAEN HAUTA\nOLET HERAETTYNYT MEIDAET")
                                msg.edit(embed);
                            }, 1500);
                        })
                        .catch(error => console.info(error));
                }, 1500);
            })
            .catch(error => console.info(error));
        resolve();
    });
}
module.exports.meta = meta;