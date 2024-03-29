import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour, ownerId, invite } from "../../config/config.json";

module.exports = {
  data: new SlashCommandBuilder().setName("about").setDescription("Learn more about Nira-chan."),

  async execute(interaction: ChatInputCommandInteraction) {
    const avatar = nicknameCheck(interaction).avatar;
    const nickname = nicknameCheck(interaction).nickname;

    const embed = new EmbedBuilder()
      .setColor(colour)
      .setAuthor({ name: nickname, iconURL: avatar })
      .setTitle(`About ${interaction.client.user!.username}`)
      .setDescription(
        `<@!${
          interaction.client.user!.id
        }> is an open-source bot created by **<@!${ownerId}>**.\n\n> To see a list of Nira's commands, use the ` +
          "`/help` command.\n\n**Nira is currently in __" +
          `${interaction.client.guilds.cache.size} servers__!**`,
      )
      .setThumbnail("https://raw.githubusercontent.com/anomalilies/Nira-chan/master/Images/Nira.png")
      .addFields(
        {
          name: "Github Repo",
          inline: true,
          value: "[Link](https://github.com/anomalilies/Nira-chan)",
        },
        {
          name: "Discord Server",
          inline: true,
          value: `[Link](https://discord.gg/${invite})`,
        },
        {
          name: "Ko-fi",
          inline: true,
          value: `[Link](https://ko-fi.com/uniguri)`,
        },
        {
          name: "Special Thanks",
          value: `Honestly, I can't thank everyone that's helped work on this project with me enough.\nBut, to **Hachan**, **Glup**, **Aravk**, **Dave**, and **Weepy**, I wouldn't have gotten to this stage without your support— **I love you all so much**!\n
            Bonus shoutouts to **Elo**, **Kasu**, **Jonno**, and everyone else from ZUTOMAYO ZONE!\n
            And to my wonderful partner, thank you so much for always supporting the passion for my hobbies and dreams — Not only in regarding them, but for all you do for me.\n**Today, and always**, you mean the world and beyond to me.\n
            **Thank you for everything, everyone. <:niralove:811608668466446356>**\nYou're all amazing!`,
        },
      );

    return interaction.reply({ embeds: [embed] });
  },
};
