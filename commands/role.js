const fs = require("fs");
const axios = require("axios");
const Tesseract = require("tesseract.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "abone",
    usage: "/abone <resim>",
    category: "Bot",
    options: [
        {
            name: "image",
            description: "Abone Olduğunuz'a Dair Bir Resim Yükleyin! (PNG Formatında Olmalıdır!)",
            type: 11,
            required: true,
        }
    ],
    admin: false,
    description: "Abone Rolü Verir.",
    run: async (client, interaction) => {
        await interaction.deferReply();

        let image = interaction.options.get("image").attachment;

        // PNG formatı kontrolü
        if (image.contentType !== "image/png") {
            const errorEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("❌ Hata")
                .setDescription("Lütfen **PNG** formatında bir resim yükleyin!")
                .addFields({
                    name: "Hata Nedeni", 
                    value: "Resim formatı doğru değil. Lütfen **PNG** formatında bir resim yükleyin.",
                    inline: false
                })
                .setImage("https://i.hizliresim.com/pgd90j0.png")
                .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });
            return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Boyut kontrolü
        if (image.size > 1920 * 1080 * 5) {
            const errorEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("❌ Hata")
                .setDescription("Lütfen **5MB**'dan küçük bir resim yükleyin!")
                .addFields({
                    name: "Hata Nedeni", 
                    value: "Resim boyutu 5MB'dan fazla. Lütfen daha küçük bir resim yükleyin.",
                    inline: false
                })
                .setImage("https://i.hizliresim.com/pgd90j0.png")
                .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });
            return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Cache klasörü oluştur
        if (!fs.existsSync("./cache")) fs.mkdirSync("./cache");
        let id = `img_${Math.floor(Math.random() * 1000000)}`;

        // Resmi indir
        let res = await axios.get(image.url, { responseType: "arraybuffer" });
        fs.writeFileSync(`./cache/${id}.png`, res.data);

        const userName = interaction.user.username;
        const currentTime = new Date().toLocaleString();

        let attempts = 0;
        const maxAttempts = 5; // Maksimum deneme sayısı
        const delay = 2000; // Her deneme arasında 2 saniye bekle

        async function processImage() {
            return new Promise((resolve, reject) => {
                Tesseract.recognize(`./cache/${id}.png`)
                    .then(({ data: { text } }) => {
                        resolve(text);
                    })
                    .catch(reject);
            });
        }

        async function tryRecognition() {
            let text = '';
            while (attempts < maxAttempts) {
                attempts++;
                text = await processImage();
                if (text.toLowerCase().includes("abone olundu")) {
                    break;
                } else {
                    console.log(`Deneme ${attempts}: 'abone olundu' bulunamadı. Yeniden deneniyor...`);
                    await new Promise(resolve => setTimeout(resolve, delay)); // Delay before next attempt
                }
            }
            return text;
        }

        try {
            const text = await tryRecognition();
            
            // Cache temizle
            fs.unlinkSync(`./cache/${id}.png`);

            const isSuccess = text.toLowerCase().includes("abone olundu");

            let successEmbed, logEmbed;
            if (isSuccess) {
                // Başarı durumu
                successEmbed = new EmbedBuilder()
                    .setColor("#00FF00")  // Yeşil renk (başarı)
                    .setTitle(`✅ Abone Rolü Verildi!`)
                    .setDescription(`Tebrikler <@${interaction.user.id}>! Abone rolün başarıyla verildi.`)
                    .addFields({
                        name: "Abone Rolü Verildi", 
                        value: "Abone rolünü aldın, abonelere özel kanalları **Hileler** kategorisinde bulabilirsin.",
                        inline: false
                    })
                    .setImage("https://i.hizliresim.com/pgd90j0.png")
                    .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });

                // Log embed'ini oluştur
                logEmbed = new EmbedBuilder()
                    .setColor("#00FF00") // Yeşil renk (başarı)
                    .setTitle(`✅ ${userName} - Başarılı`)
                    .setDescription(`Kullanıcı ${userName} abone rolünü başarıyla aldı.`)
                    .addFields({
                        name: "Gönderilen Resim", 
                        value: `[Resmi Görüntüle](<${image.url}>)`,
                        inline: false
                    })
                    .setImage(image.url) 
                    .setFooter({
                        text: `${userName} - ${currentTime}`,
                        iconURL: interaction.user.avatarURL()
                    });

                // Rol ekleme
                let role = interaction.guild.roles.cache.get(config.subscriberRole);
                if (role) {
                    interaction.member.roles.add(role)
                        .then(() => {
                            const logChannel = interaction.guild.channels.cache.get(config.logid);
                            if (logChannel) {
                                logChannel.send({ embeds: [logEmbed] });
                            }
                            interaction.editReply({ embeds: [successEmbed] });
                        })
                        .catch(err => {
                            console.error("Rol eklenirken hata:", err);
                            const errorEmbed = new EmbedBuilder()
                                .setColor("#FF0000")
                                .setTitle("❌ Hata")
                                .setDescription("Rol verilirken bir hata oluştu! Lütfen yetkililere bildirin.")
                                .setImage("https://i.hizliresim.com/pgd90j0.png")
                                .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });
                            interaction.editReply({ embeds: [errorEmbed] });
                        });
                } else {
                    const errorEmbed = new EmbedBuilder()
                        .setColor("#FF0000")
                        .setTitle("❌ Hata")
                        .setDescription("Abone rolü bulunamadı! Lütfen yetkililere bildirin.")
                        .setImage("https://i.hizliresim.com/pgd90j0.png")
                        .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });
                    interaction.editReply({ embeds: [errorEmbed] });
                }
            } else {
                // Başarısız durumu
                successEmbed = new EmbedBuilder()
                    .setColor("#FF0000")  // Kırmızı renk (başarısız)
                    .setTitle(`❌ Hata`)
                    .setDescription("Abone olduğunuzu doğrulayamıyoruz! Lütfen doğru bir ekran görüntüsü yükleyin.")
                    .addFields({
                        name: "Hata Nedeni", 
                        value: "Abone olduğunuzu doğrulayamıyoruz. Lütfen ekran görüntüsünün doğru olduğundan emin olun.",
                        inline: false
                    })
                    .setImage("https://i.hizliresim.com/pgd90j0.png")
                    .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });

                // Log embed'ini oluştur
                logEmbed = new EmbedBuilder()
                    .setColor("#FF0000") // Kırmızı renk (başarısız)
                    .setTitle(`❌ ${userName} - Başarısız`)
                    .setDescription(`Kullanıcı ${userName} abone rolünü alamadı. Doğrulama başarısız oldu.`)
                    .addFields({
                        name: "Gönderilen Resim", 
                        value: `[Resmi Görüntüle](<${image.url}>)`,
                        inline: false
                    })
                    .setImage(image.url) 
                    .setFooter({
                        text: `${userName} - ${currentTime}`,
                        iconURL: interaction.user.avatarURL()
                    });

                const logChannel = interaction.guild.channels.cache.get(config.logid);
                if (logChannel) {
                    logChannel.send({ embeds: [logEmbed] });
                }

                interaction.editReply({ embeds: [successEmbed] });
            }
        } catch (err) {
            console.error("Tesseract.js Hatası:", err);
            const errorEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("❌ Hata")
                .setDescription("Resmi işlerken bir hata oluştu! Lütfen tekrar deneyin.")
                .addFields({
                    name: "Hata Nedeni", 
                    value: "Resmi işlerken hata oluştu. Lütfen tekrar deneyin.",
                    inline: false
                })
                .setImage("https://i.hizliresim.com/pgd90j0.png")
                .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });
            interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
