const Discord = require('discord.js');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const prefix = process.env.PREFIX;

fs.readdir('./commands', (err, files) => {
    if (err) console.error(err);
    let jsFiles = files.filter((f) => f.split('.').pop() === 'js');
    if (jsFiles.length <= 0) {
        console.warn('No commands');
        return;
    }

    console.log(`Loading ${jsFiles.length} commands`);

    jsFiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        bot.commands.set(props.info.name, props);
    });
});

bot.on('ready', async () => {
    console.log(`Bot Ready: ${bot.user.username}`);

    try {
        let link = await bot.generateInvite(8);
        console.log(link);
    } catch (e) {
        console.error(e.stack);
    }

    bot.user.setPresence({
        status: 'online',
        activity: {
            name: `the prefix: ${process.env.PREFIX}`,
            type: 'WATCHING',
        },
    });
});

bot.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') {
        message.channel.send(
            "This bot doesn't work in DM's. Please use commands in a server channel"
        );
        return;
    }
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.split(' ');
    let command = bot.commands.get(args.shift().slice(prefix.length));

    if (command) {
        if (command.info.requiredRole !== '') {
            if (!message.member.roles.cache.get(command.info.requiredRole)) {
                message.channel.send('You dont have permission to run that command');
                return;
            }
        }

        command.run(bot, message, args).catch((e) => {
            if (e) {
                console.error(e.stack);
                message.channel.send('There was an error performing this command');
            }
        });
    }
});

bot.login(process.env.DISCORD_TOKEN);
