import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export default {
    name: "channelCreate",
    async execute(channel, _client_) {
        const config = _client_.config;

        if (!channel.parentId || !config.ticket.categories.includes(channel.parentId)) return;
        if (!channel.isTextBased()) return;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("claim_ticket")
                .setLabel("🛡 استلام التذكرة")
                .setStyle(ButtonStyle.Success)
        );

        const embed = new EmbedBuilder()
            .setTitle("🎫 تذكرة جديدة تم فتحها!")
            .setDescription(
                "هناك تذكرة جديدة تحتاج إلى متابعـة من قبل فريق الإدارة.\n\n" +
                "أداري: اضغط على الزر أدناه لتولي هذه التذكرة وبدء التعامل معها."
            )
            .setColor("#00bfff")
            .setFooter({ text: "نظام التذاكر • شكراً لتعاونكم!" })
            .setTimestamp();

        await channel.send({
            embeds: [embed],
            components: [row]
        });
    }
};
