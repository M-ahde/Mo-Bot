import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("testt"),
    async execute(interaction) {

        await interaction.reply("Pong!");
    },
};
