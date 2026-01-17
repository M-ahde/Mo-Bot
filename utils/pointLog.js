import { EmbedBuilder } from "discord.js";

/**
 * sendPointLog
 * @param {Client} client - البوت
 * @param {string} action - نوع العملية: "Add", "Remove", "Set"
 * @param {User} target - العضو المستهدف
 * @param {User} admin - الأداري الذي نفذ العملية
 * @param {number} amount - عدد النقاط
 * @param {string} logChannelId - ID قناة اللوغ
 */
export async function sendPointLog(client, action, target, admin, amount, logChannelId) {
    const logChannel = await client.channels.fetch(logChannelId).catch(() => null);
    if (!logChannel || !logChannel.isTextBased()) return;

    const embed = new EmbedBuilder()
        .setTitle(`📊 تعديل نقاط`)
        .setColor(action === "Add" ? "Green" : action === "Remove" ? "Red" : "Yellow")
        .addFields(
            { name: "العملية", value: action, inline: true },
            { name: "العضو المستهدف", value: `<@${target.id}>`, inline: true },
            { name: "الأداري", value: `<@${admin.id}>`, inline: true },
            { name: "عدد النقاط", value: `${amount}`, inline: true }
        )
        .setTimestamp();

    await logChannel.send({ embeds: [embed] });
}
