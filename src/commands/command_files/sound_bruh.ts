import Command, { CommandConfiguration, CommandExecutor } from '../Command'
import playSound from '../../sound_handling/playSound'

const configuration: CommandConfiguration = {
    name: 'sheesh',
    admin: false,
    syntax: 'sheesh',
    desc: 'sheesh sound effect #2',
    triggers: ['sheesh', 'sheets', 'cheese'],
    type: ['sound']
}

let soundfile = './assets/sound/sheesh.mp3'

const executor: CommandExecutor = async (message, client, args) => {
    playSound({ soundfile, message })
}

export default new Command({
    configuration,
    executor
})
