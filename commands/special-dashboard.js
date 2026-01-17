import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("special-dashboard")
        .setDescription("إرسال لوحة التحكم بالرتب الخاصة")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🎛️ لوحة التحكم بالرتبة الخاصة")
            .setDescription(
                "يمكنك تعديل الرتبة الخاصة بك باستخدام الخيارات أدناه:\n\n" +
                "✏️ **تغيير اسم الرتبة**\n" +
                "🎨 **تغيير لون الرتبة**\n" +
                "😀 **تغيير أيقونة الرتبة**\n\n" +
                "🧑‍💼 **إدارة المستخدمين الذين لديهم الرتبة**"
            )
            .setColor("Blurple")
            .setFooter({ text: "Special Role Dashboard" });

        // الصف الأول: تعديل الرتبة
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("sr_edit_name")
                .setLabel("تغيير الاسم")
                .setEmoji("✏️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("sr_edit_color")
                .setLabel("تغيير اللون")
                .setEmoji("🎨")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("sr_edit_icon")
                .setLabel("تغيير الأيقونة")
                .setEmoji("😀")
                .setStyle(ButtonStyle.Success)
        );

        // الصف الثاني: إدارة المستخدمين
        const manageRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("sru_add_user")
                .setLabel("إضافة مستخدم")
                .setEmoji("➕")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("sru_remove_user")
                .setLabel("إزالة مستخدم")
                .setEmoji("➖")
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            content: "✅ تم إرسال لوحة التحكم بنجاح",
            ephemeral: true
        });

        await interaction.channel.send({
            embeds: [embed],
            components: [row, manageRow]
        });
    }
};
