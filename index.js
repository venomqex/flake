const {
    Client,
    Collection,
    Discord,
    Attachment,
    ActivityType
} = require('discord.js');
const client = new Client({
    intents: 32767
});
const colors = require('colors');
global.EmbedBuilder = require('discord.js').EmbedBuilder;
global.fs = require('fs');
global.moment = require('moment');
global.config = require('./config.js');

if (!fs.existsSync('./cache')) {
    fs.mkdirSync('./cache');
} else {
    fs.readdirSync('./cache').forEach(file => {
        fs.unlinkSync(`./cache/${file}`);
    });
}

require("./load.js")(client);

    // 10 saniyede bir rolün sahiplerini sayıp, durumu güncelleme işlemi
    setInterval(async () => {
        // Config dosyasından sunucu ID'sini ve rol ID'sini alıyoruz
        const serverId = config.serverId;
        const roleId = config.subscriberRole;

        // Sunucuyu buluyoruz
        const guild = client.guilds.cache.get(serverId);
        if (!guild) {
            console.error('Sunucu bulunamadı!');
            return;
        }

        // Rolü sunucuda bulalım
        const role = guild.roles.cache.get(roleId);
        if (!role) {
            console.error('Belirtilen rol bulunamadı!');
            return;
        }

        // Rolü sahiplenen kullanıcıların sayısını alalım
        const memberCount = role.members.size;
        
        // Aktiviteyi güncelle
        client.user.setPresence({
            activities: [{
                name: `${memberCount} kişiye rol verildi`,  // Aktiviteyi belirliyoruz
                type: 0  // "PLAYING" türünde bir etkinlik
            }],
            status: 'online'
        });
    }, 10000);  // Her 10 saniyede bir güncellenir (10000 milisaniye)

client.login(config.token).catch(() => console.log(`${colors.bgRed('[HATA]').black} --> ${colors.red('Botun Tokeni Geçersiz! Lütfen Tokeni Kontrol Ediniz!')}`.red));