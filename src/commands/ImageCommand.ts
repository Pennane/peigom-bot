import Discord from 'discord.js'
import sharp from 'sharp'
import Command, { CommandConfiguration, CommandExecutor } from './Command'
import { fetchFile } from '../util/misc'
import fs from 'fs'

export type ImageManipulator = (sharp: sharp.Sharp) => sharp.Sharp

export type CommandBaseImageManipulator = (
    sharp: sharp.Sharp,
    message: Discord.Message,
    client: Discord.Client,
    args: string[]
) => sharp.Sharp

export interface ImageCommandConfiguration extends CommandConfiguration {
    imageName: string
    imageTitle: string
}

export interface ImageCommandInitializer {
    configuration: ImageCommandConfiguration
    manipulator: ImageManipulator | CommandBaseImageManipulator
}

export type ImageCommandExecutor = (
    message: Discord.Message,
    client: Discord.Client,
    args: Array<string>,
    manipulator: ImageManipulator
) => Promise<any>

export class ImageCommand extends Command {
    manipulator: CommandBaseImageManipulator
    imageName: string
    imageTitle: string

    constructor(initializer: ImageCommandInitializer) {
        super({
            ...initializer,
            executor: async (message: Discord.Message, client: Discord.Client, args: Array<string>) => {}
        })

        const { configuration } = initializer

        this.manipulator = initializer.manipulator
        this.imageName = configuration.imageName
        this.imageTitle = configuration.imageTitle
    }

    executor: CommandExecutor = async (message, client, args) => {
        if (!message.guild) return

        let targetUser: Discord.User

        if (args[1]) {
            let target = args[1].replace(/\D/g, '')
            let member = message.guild.members.cache.get(target)
            if (!member?.user) return message.channel.send('broidi kohdennettu ukko on rikki')
            targetUser = member.user
        } else {
            targetUser = message.author
        }

        let now = new Date()

        let identifier = `-${now.getFullYear}-${now.getMonth}-${now.getDate}-${now.getHours}`

        let avatarFile = `./assets/images/avatars/avatar${targetUser.id}${identifier}.jpg`

        if (!fs.existsSync(avatarFile)) {
            let avatar = targetUser.displayAvatarURL({
                format: 'jpg',
                dynamic: false,
                size: 512
            })
            await fetchFile({ url: avatar, target: avatarFile })
        }

        let embed = Command.createEmbed()

        const randomId = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9)
        const temporaryImage = `./assets/images/${Date.now()}-${randomId}.jpg`

        embed.setTitle(this.imageTitle)

        await this.manipulator(sharp(avatarFile), message, client, args).toFile(temporaryImage)

        embed.setImage(`attachment://${this.imageName}.jpg`)

        await message.channel.send({
            embed: embed,
            files: [
                {
                    attachment: temporaryImage,
                    name: `${this.imageName}.jpg`
                }
            ]
        })

        fs.unlinkSync(temporaryImage)
        fs.unlinkSync(avatarFile)
        return
    }
    async execute(message: Discord.Message, client: Discord.Client, args: Array<string>): Promise<void> {
        if (this._requireGuild && !message.guild) return

        let adminAuthorization = false

        if (!client || !client.user) return

        if (this._adminCommand) {
            adminAuthorization = Command.isMemberAdminAuthorized(message)
        }

        if (this._adminCommand && !adminAuthorization) {
            return this.unauthorizedAction(message)
        }

        this.executor(message, client, args).catch((err) => console.info(err))
    }
}

export default ImageCommand