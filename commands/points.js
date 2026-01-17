import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription("عرض نقاط أداري")
        .addUserOption(opt => opt.setName("user").setDescription("اختر العضو").setRequired(false)),

    async execute(interaction, _client_) {
        const db = _client_.db;
        const config = _client_.config;

        const member = interaction.member;
        const target = interaction.options.getUser("user") || interaction.user;

        const isAdmin = member.roles.cache.some(role => config.ticket.allowedRoles.includes(role.id));
        if (!isAdmin) return interaction.reply({ content: "❌ أنت غير مخوّل.", ephemeral: true });

        const points = await db.get(`points_${target.id}`) || 0;
        
        return interaction.reply(`ℹ️ نقاط <@${target.id}>: ${points}`);
    }
};
