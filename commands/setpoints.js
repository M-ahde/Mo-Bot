import { SlashCommandBuilder } from "discord.js";
import { sendPointLog } from "../utils/pointLog.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setpoints")
        .setDescription("تعيين نقاط أداري")
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

        await db.set(`points_${target.id}`, amount);
        await sendPointLog(_client_, "setPointes", target, member.user, amount, config.points.log);
        
        return interaction.reply(`✅ تم تعيين نقاط <@${target.id}> إلى ${amount}`);
    }
};
