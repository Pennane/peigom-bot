const Discord = require('discord.js');

let embed = new Discord.RichEmbed().setColor(0xF4E542);

const meta = {
    name: "sudo",
    admin: true,
    syntax: "sudo <#text-kanava> <teksti>",
    desc: "Lähettää asettamasi viestin asettamallesi tekstikanavalle.",
    triggers: ["sudo"]
}

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        embed.setDescription(`\`${meta.syntax}\``)
            .setTitle(`Komento ${meta.name} toimii näin:`)
        if (args[2]) {
            let channelid = args[1].replace(/\D/g, '');
            let sudochannel = client.channels.get(channelid);
            if (sudochannel) {
                if (args[3]) {
                    for (let i = 3; i < args.length; i++) {
                        args[2] = args[2] + ' ' + args[i];
                    }
                }
                if (typeof (args[2]) !== 'string') {
                    args[2] = args[2].toString();
                }
                sudochannel.send(args[2])
                    .catch(err => console.info(error));
            } else {
                msg.channel.send(embed)
                    .then(msg => {
                        msg.delete(15001)
                    })
                    .catch(err => console.info(error));
            }
        } else {
            msg.channel.send(embed)
                .then(msg => {
                    msg.delete(15001)
                })
                .catch(err => console.info(error));
        }
        msg.delete(10000);
        resolve();
    });
}

module.exports.meta = meta;