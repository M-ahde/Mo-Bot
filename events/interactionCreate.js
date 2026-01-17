export default {
    name: "interactionCreate",
    async execute(interaction, _) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        console.log(interaction.commandName)
        if (!command) return;

        try {
            await command.execute(interaction,_);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error executing that command.", ephemeral: true });
        }
    },
};
