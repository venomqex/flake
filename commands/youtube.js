module.exports = {
    name: "youtube",
    usage: "/youtube",
    category: "Bot",
    admin: true,
    description: "Youtube",
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .addFields(
                { name: "Youtube", value: "Youtube kanalımız : [Youtube](https://www.youtube.com/@flake006)"},
            )
            .addFields({
                name: "Unutmayın!", 
                value: "Abone sslerinizi tam ekran olarak yollayın",
                inline: false
            })
            .setImage("https://i.hizliresim.com/pgd90j0.png")
            .setFooter({ text: "FlakeCheats tarafından destekleniyor", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" })
            .setThumbnail("https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240")
            .setColor(0x57F287)
            .setFooter({ text: "youtube.com/@flake006", iconURL: "https://cdn.discordapp.com/icons/1068524372639371404/79e638c98b04bbe62f3f270b0072d091.webp?size=240" });
        interaction.reply({ embeds: [embed] });
    },
};