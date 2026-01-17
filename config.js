export default {

    welcome: {
        message: `أهلاً بك في السيرفر، <@{user}>! 🎉`,
        image: "https://raw.githubusercontent.com/ZarScape/ZarScape/refs/heads/main/images/ZarScape/logo-with-background.png",
        channelId: ""
    },

    ticket: {
        categories: [""], // قائمة كاتيجوريز التذاكر
        allowedRoles: [""], // رولات يمكنها تسلم التذاكر
        rewardPoints: 50,
    },

    points: {
        chatCooldown: 1, // دقائق
        voiceCooldown: 10, // دقائق
        chatPoints: 5,
        voicePoints: 10,
        maxMessageLength: 2000,
        log: "" // ID القناة التي تُسجل فيها نقاط الأعضاء
    },

    specialRole: {
        positionBelowRoleId: "", // الرتبة التي ستوضع الرتبة الجديدة تحتها
        color: "Blue", // اللون الافتراضي للرتبة
    },

    rolePermissionsOptions: [
        { label: "إرسال رسائل", value: "SendMessages" },
        { label: "إرسال صور وملفات", value: "AttachFiles" },
        { label: "وضع ردود أفعال", value: "AddReactions" },
        { label: "استخدام إيموجيات خارجية", value: "UseExternalEmojis" },
        { label: "إرسال ستكرات", value: "SendMessagesInThreads" }
    ]
};
