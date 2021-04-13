import Discord from 'discord.js'
import c from 'chalk'
import fs from 'fs'
import schedule from 'node-schedule'

import time from './getTime'
import ZimmerTj from '../lib/zimmerTJ'
import badwords from '../assets/badwords/badwords.json'
import commandLoader from '../commands/loader'
import { randomFromArray, shuffleArray } from './util'
import { DISCORD, LOG_USED_COMMANDS, COMMAND_SPAM_PROTECTION, PREFIX, ClientActivity } from './config'

let { ACTIVITIES, REFRESH_RATE } = DISCORD.PRESENCE

let moneyUserData = fs.existsSync('./data/raha/user-data.json')
    ? JSON.parse(fs.readFileSync('./data/raha/user-data.json', 'utf8'))
    : undefined

const setActivity = (activity: ClientActivity, client: Discord.Client) => {
    if (!client.user) return

    let activityObject = {
        name: activity.text,
        type: activity.type,
        url: activity.type === 'STREAMING' ? 'https://www.twitch.tv/ninja' : undefined
    }
    client.user.setPresence({
        status: 'online',
        afk: false,
        activity: activityObject
    })
}

const init = async ({ client, timing }: { client: Discord.Client; timing: { timer: Date; completed: boolean } }) => {
    ZimmerTj(client)

    const activities = shuffleArray(ACTIVITIES)

    setActivity(randomFromArray(activities), client)

    schedule.scheduleJob(`*/${REFRESH_RATE} * * * *`, () => {
        setActivity(randomFromArray(activities), client)
    })

    if (client.user) {
        console.info(c.yellow('Logged in as ') + c.bgYellow.black(' ' + client.user.tag + ' '))
    } else {
        console.info(c.red('Failed to get client user'))
    }

    console.info(c.yellow('| Time: ') + time.get(true))

    if (!timing.completed) {
        console.info(c.yellow(`| Connected in ${Date.now() - timing.timer.getTime()} ms`))
        timing.completed = true
    }

    let { commands } = await commandLoader()

    console.info(c.yellow('| Loaded: ') + commands.size + ' commands')
    console.info(c.yellow('| Loaded: ') + client.guilds.cache.size + ' servers')
    console.info(c.yellow('| Loaded: ') + (moneyUserData ? moneyUserData.length : 0) + ' users with ' + PREFIX + 'raha')
    console.info(c.yellow('| Loaded: ') + badwords.length + ' forbidden words')
    console.info(c.yellow('| Log user used commands: ') + (LOG_USED_COMMANDS ? c.green('true') : c.red('false')))
    console.info(
        c.yellow('| Command spam protection: ') + (COMMAND_SPAM_PROTECTION.STATE ? c.green('true') : c.red('false'))
    )
}

const infoUpdater = {
    init
}

export default infoUpdater
