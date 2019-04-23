const sound = require('../functions/play-sound.js');
const ffmpeg = require("ffmpeg");
const Discord = require('discord.js');

let embed = new Discord.RichEmbed()
    .setColor(0xF4E542);
0

let info = {
    name: "ooof",
    admin: false,
    syntax: "ooof",
    desc: "elongated oof"
}
let syntax = info.syntax;

module.exports.run = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        let userid = args[1] && msg.authorized ? args[1].replace(/\D/g, '') : null
        let voiceChannel = userid ? msg.guild.members.get(userid).voiceChannel : msg.member.voiceChannel
        if (voiceChannel && !(msg.guild.voiceConnection)) {
            voiceChannel.join()
                .then(connection => {
                    sound.play('./assets/sound/ooof.mp3', msg, connection, client)
                        .then(resolve());
                });
        } else if (!msg.member.voiceChannel) {
            resolve();
            embed.setTitle(`Botin kommentti:`)
                .setDescription(`${msg.member.user.username} mene eka jollekki voicechannelille, kid.`);
            msg.channel.send(embed)
                .catch(error => console.info(error));
        } else {
            resolve();
        }

    });
}
module.exports.info = info;