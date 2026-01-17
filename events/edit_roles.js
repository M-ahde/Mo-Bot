import {
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} from "discord.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const db = client.db;
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    const botMember = interaction.guild.members.me;
    if (!botMember.permissions.has("ManageRoles")) return;

    if (interaction.customId === "sr_edit_name") {
      const modal = new ModalBuilder()
        .setCustomId("sr_name_modal")
        .setTitle("تغيير اسم الرتبة");

      const input = new TextInputBuilder()
        .setCustomId("role_name")
        .setLabel("الاسم الجديد")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (interaction.customId === "sr_edit_color") {
      const modal = new ModalBuilder()
        .setCustomId("sr_color_modal")
        .setTitle("تغيير لون الرتبة");

      const input = new TextInputBuilder()
        .setCustomId("role_color")
        .setLabel("ادخل اللون بالـ HEX (مثال: #ff0000)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (interaction.customId === "sr_edit_icon") {
      const modal = new ModalBuilder()
        .setCustomId("sr_icon_modal")
        .setTitle("تغيير أيقونة الرتبة");

      const input = new TextInputBuilder()
        .setCustomId("role_icon")
        .setLabel("أدخل رابط صورة أو Discord Emoji")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (interaction.customId === "sru_add_user") {
      const modal = new ModalBuilder()
        .setCustomId("sr_add_user_modal")
        .setTitle("إضافة مستخدم للرتبة");

      const input = new TextInputBuilder()
        .setCustomId("add_user_id")
        .setLabel("ادخل منشن المستخدم أو ID")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (interaction.customId === "sru_remove_user") {
      const modal = new ModalBuilder()
        .setCustomId("sr_remove_user_modal")
        .setTitle("إزالة مستخدم من الرتبة");

      const input = new TextInputBuilder()
        .setCustomId("remove_user_id")
        .setLabel("ادخل منشن المستخدم أو ID")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));
      return interaction.showModal(modal);
    }

    if (interaction.isModalSubmit()) {
      const roleData = await db.get(`specialRole-${interaction.user.id}`);
      if (!roleData)
        return interaction.reply({
          content: "❌ لا تملك رتبة خاصة.",
          ephemeral: true,
        });

      const role = interaction.guild.roles.cache.get(roleData.roleId);
      if (!role)
        return interaction.reply({
          content: "❌ الرتبة غير موجودة.",
          ephemeral: true,
        });

      if (interaction.customId === "sr_name_modal") {
        const newName = interaction.fields
          .getTextInputValue("role_name")
          .trim();
        await role.setName(newName).catch((err) => console.error(err));
        return interaction.reply({
          content: `✅ تم تغيير اسم الرتبة إلى **${newName}**`,
          ephemeral: true,
        });
      }

      if (interaction.customId === "sr_color_modal") {
        const color = interaction.fields.getTextInputValue("role_color").trim();
        if (!/^#([0-9A-F]{6})$/i.test(color))
          return interaction.reply({
            content: "❌ اللون غير صالح. استخدم صيغة HEX مثل #ff0000",
            ephemeral: true,
          });

        await role.setColor(color).catch((err) => console.error(err));
        return interaction.reply({
          content: `✅ تم تغيير لون الرتبة إلى **${color}**`,
          ephemeral: true,
        });
      }

      if (interaction.customId === "sr_icon_modal") {
        const input = interaction.fields.getTextInputValue("role_icon").trim();
        let url;

        const emojiMatch = input.match(/<(a)?:\w+:(\d+)>/);
        if (emojiMatch) {
          const id = emojiMatch[2];
          url = `https://cdn.discordapp.com/emojis/${id}.png`;
        } else if (/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i.test(input)) {
          url = input;
        } else {
          return interaction.reply({
            content: "❌ يجب أن يكون الإدخال Emoji مخصص أو رابط صورة.",
            ephemeral: true,
          });
        }

        await role.setIcon(url).catch((err) => {
          if (err.code === 50101)
            return interaction.reply({
              content: "❌ السيرفر يحتاج Boost أعلى لتغيير أيقونة الرتبة.",
              ephemeral: true,
            });
          console.error(err);
        });

        return interaction.reply({
          content: "✅ تم تغيير أيقونة الرتبة بنجاح.",
          ephemeral: true,
        });
      }

      if (interaction.customId === "sr_add_user_modal") {
        const userInput = interaction.fields
          .getTextInputValue("add_user_id")
          .trim();
        const user = await interaction.guild.members
          .fetch(userInput.replace(/[<@!>]/g, ""))
          .catch(() => null);
        if (!user)
          return interaction.reply({
            content: "❌ لم أتمكن من العثور على المستخدم.",
            ephemeral: true,
          });

        const roleData = await db.get(`specialRole-${interaction.user.id}`);
        if (!roleData)
          return interaction.reply({
            content: "❌ لا تملك رتبة خاصة.",
            ephemeral: true,
          });

        if (!roleData.otherUsers) roleData.otherUsers = [];
        if (roleData.otherUsers.length >= 2) {
          return interaction.reply({
            content: "❌ لا يمكن إضافة أكثر من شخصين إضافيين لهذه الرتبة.",
            ephemeral: true,
          });
        }

        if (roleData.otherUsers.some((u) => u === user.id)) {
          return interaction.reply({
            content: "❌ هذا المستخدم موجود بالفعل ضمن هذه الرتبة.",
            ephemeral: true,
          });
        }

        roleData.otherUsers.push(user.id);

        await db.set(`specialRole-${interaction.user.id}`, roleData);

        const role = interaction.guild.roles.cache.get(roleData.roleId);
        if (role) await user.roles.add(role).catch((err) => console.error(err));

        return interaction.reply({
          content: `✅ تم إضافة ${user.user.tag} للرتبة لمدة شهر.`,
          ephemeral: true,
        });
      }

      if (interaction.customId === "sr_remove_user_modal") {
        const userInput = interaction.fields
          .getTextInputValue("remove_user_id")
          .trim();
        const user = await interaction.guild.members
          .fetch(userInput.replace(/[<@!>]/g, ""))
          .catch(() => null);
        if (!user)
          return interaction.reply({
            content: "❌ لم أتمكن من العثور على المستخدم.",
            ephemeral: true,
          });

        const roleData = await db.get(`specialRole-${interaction.user.id}`);
        if (!roleData.otherUsers.includes(user.id)) {
          return interaction.reply({
            content: "❌ هذا المستخدم ليس ضمن الرتبة أو تمت إزالته بالفعل.",
            ephemeral: true,
          });
        }

        roleData.otherUsers = roleData.otherUsers.filter(
          (uId) => uId !== user.id,
        );
        await db.set(`specialRole-${interaction.user.id}`, roleData);

        const role = interaction.guild.roles.cache.get(roleData.roleId);
        if (role)
          await user.roles.remove(role).catch((err) => console.error(err));

        return interaction.reply({
          content: `✅ تم إزالة ${user.user.tag} من الرتبة.`,
          ephemeral: true,
        });
      }
    }
  },
};
