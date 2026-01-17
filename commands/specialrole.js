import {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} from "discord.js";
import config from "../config.js";

export default {
    data: new SlashCommandBuilder()
        .setName("specialrole")
        .setDescription("إنشاء رتبة خاصة لعضو")
        .addUserOption(o =>
            o.setName("user")
                .setDescription("العضو")
                .setRequired(true)
        )
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction,_client_) {
        const user = interaction.options.getUser("user");
       const db = _client_.db;

const hasSpecialRole = await db.get(`specialRole-${user.id}`);

if (hasSpecialRole) {
    return interaction.reply({
        content: "⚠️ هذا العضو لديه رتبة خاصة بالفعل.",
        ephemeral: true
    });
}
        const embed = new EmbedBuilder()
            .setTitle("🎛️ إعداد الرتبة الخاصة")
            .setDescription(`اختر الصلاحيات التي تريد منحها لـ <@${user.id}>`)
            .setColor("Blue");

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`specialrole_select:${user.id}`)
            .setPlaceholder("اختر الصلاحيات")
            .setMinValues(1)
            .setMaxValues(config.rolePermissionsOptions.length)
            .addOptions(config.rolePermissionsOptions);

        await interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(menu)],
            ephemeral: true
        });
    }
};
