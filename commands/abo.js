const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "sil",
    usage: "/sil <sayısı>",
    category: "Bot",
    admin: true,
    description: "Belirtilen sayıda mesaj siler.",
    options: [
        {
            name: "sayisi",
            description: "Silmek istediğiniz mesaj sayısını girin",
            type: 4, // INTEGER type'ı
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const amount = interaction.options.getInteger("sayisi");

        // Mesaj sayısının geçerli olup olmadığını kontrol ediyoruz.
        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: "Lütfen 1 ile 100 arasında bir sayı girin.",
                ephemeral: true,
            });
        }

        try {
            // Mesajları silme işlemi
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.channel.bulkDelete(fetchedMessages);

            // Silme işlemi başarıyla gerçekleştiyse, kullanıcıya bilgilendirme mesajı gönderiyoruz
            const successEmbed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("✅ Başarılı")
                .setDescription(`${amount} mesaj başarıyla silindi!`)
                .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" })
                .setThumbnail("https://i.hizliresim.com/pgd90j0.png");

            await interaction.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error("Mesaj silme hatası:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle("❌ Hata")
                .setDescription("Mesaj silme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.")
                .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" })
                .setThumbnail("https://i.hizliresim.com/pgd90j0.png");

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
