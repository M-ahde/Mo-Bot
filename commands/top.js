import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("topstaff")
        .setDescription("عرض أفضل الإداريين حسب النقاط"),

    async execute(interaction, _client_) {
        if (!interaction.isChatInputCommand()) return;

        const db = _client_.db;
        const config = _client_.config;

        const isAdmin = interaction.member.roles.cache.some(role => config.ticket.allowedRoles.includes(role.id));
        if (!isAdmin) {
            return interaction.reply({ content: "❌ أنت غير مخوّل لاستخدام هذا الأمر.", ephemeral: true });
        }

        let allData;
        try {
            allData = (await db.all()).filter(entry => entry.id.startsWith("points_"));
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "❌ حدث خطأ أثناء جلب النقاط.", ephemeral: true });
        }

        if (!allData.length) {
            return interaction.reply({ content: "لا توجد نقاط مسجلة حالياً.", ephemeral: true });
        }

        const sorted = allData.sort((a, b) => b.data - a.data).slice(0, 10);

        let description = "";
        sorted.forEach((entry, index) => {
            const userId = entry.id.replace("points_", "");
            description += `**#${index + 1}** <@${userId}> — \`${entry.value} نقطة\`\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle("🏆 تصنيف أفضل الإداريين")
            .setDescription(description)
            .setColor("Gold")
            .setTimestamp()
            .setFooter({ text: "Top Staff | نقاط الإدارة" });

        await interaction.reply({ embeds: [embed] });
    }
};
