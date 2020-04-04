const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const Discord = require('discord.js');

let embed = new Discord.MessageEmbed().setColor(0xF4E542);

const configuration = {
    name: "jpeg",
    admin: false,
    syntax: "jpeg",
    desc: "Luulekko et mä tiedän mikä jpeg on? Haluun vaa kuvan mun hodarista.",
    triggers: ["jpeg", "jpg"],
    type: ["image"]
}

module.exports.executor = function (msg, client, args) {
    return new Promise((resolve, reject) => {
        function rest() {
            let rand = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            let imgname = `./assets/images/${rand}.jpg`;
            imgname = String(imgname);
            embed
                .setTitle("Hyper jpeg laatu");

            sharp(avatarfile)
                .resize(256, 256)
                .jpeg({ quality: 1 })
                .toFile(imgname)
                .then(image => {
                    embed.setImage(`attachment://jpeg.jpg`);
                    msg.channel.send({
                        embed: embed,
                        files: [{
                            attachment: imgname,
                            name: 'jpeg.jpg'
                        }]
                    })
                        .then(image => {
                            fs.unlinkSync(imgname);
                            fs.unlinkSync(avatarfile);
                        })
                        .catch(err => console.info(err));
                })
                .catch(err => console.info(err));
        }
        let targetUser = args[1] ? msg.guild.members.cache.get(args[1].replace(/\D/g, '')).user : msg.author
        if (!targetUser) {
            return resolve()
        }
        let avatar = targetUser.avatarURL();
        let avatarfile = `./assets/images/avatars/avatar${targetUser.id}${Date.now()}.jpg`;
        let i = 0;
        if (fs.existsSync(avatarfile)) {
            rest();
        }
        if (!fs.existsSync(avatarfile)) {

            let file = fs.createWriteStream(avatarfile);
            https.get(avatar, function (response) {
                response.pipe(file)

            });

            file.on('finish', function () {
                i++;
                if (i = 1) {
                    rest();
                }
            });
        }
        resolve();
    })
}
module.exports.configuration = configuration;