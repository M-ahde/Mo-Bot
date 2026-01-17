import { SlashCommandBuilder } from "discord.js";
import { sendPointLog } from "../utils/pointLog.js";

export default {
    data: new SlashCommandBuilder()
        .setName("removepoints")
        .setDescription("إزالة نقاط من أداري")
        .addUserOption(opt => opt.setName("user").setDescription("اختر العضو").setRequired(true))
        .addIntegerOption(opt => opt.setName("amount").setDescription("عدد النقاط").setRequired(true)),

    async execute(interaction, _client_) {
        const db = _client_.db;
        const config = _client_.config;

        const member = interaction.member;
        const target = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        const isAdmin = member.roles.cache.some(role => config.ticket.allowedRoles.includes(role.id));
        if (!isAdmin) return interaction.reply({ content: "❌ أنت غير مخوّل.", ephemeral: true });

        const prevPoints = await db.get(`points_${target.id}`) || 0;
        const newPoints = Math.max(prevPoints - amount, 0);
        await db.set(`points_${target.id}`, newPoints);
await sendPointLog(_client_, "Remove", target, member.user, amount, config.points.log);

        return interaction.reply(`✅ تم إزالة ${amount} نقطة من <@${target.id}>. المجموع الآن: ${newPoints}`);
    }
};
