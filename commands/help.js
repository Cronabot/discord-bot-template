module.exports.run = async (bot, message, args) => {
    let output = '';
    bot.commands.forEach((command) => {
        output += `\`${command.info.name} - ${command.info.description}\`\n`;
    });

    message.member.user.send(
        `Here are the commands:\n${output}\nThe prefix for this server is currently \`${process.env.PREFIX}\``
    );
};

module.exports.info = {
    name: 'help',
    description: 'shows this message',
    requiredRole: '',
};
