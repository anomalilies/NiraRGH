/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour, guildId, invite } from "../../config/config.json";

module.exports = {
  data: new SlashCommandBuilder().setName("invite").setDescription("Create an invitation."),
  async execute(interaction: ChatInputCommandInteraction) {
    const botName = interaction.client.user!.username as string;
    const botID = interaction.client.user!.id as string;

    const botInvite = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(`Invite ${botName}`)
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${botID}&permissions=805661760&scope=bot%20applications.commands`,
        ),
    );

    if (interaction.guild?.id === guildId) {
      const avatar = nicknameCheck(interaction).avatar;
      const nickname = nicknameCheck(interaction).nickname;
      const guildName = interaction.guild?.name as string;

      const embed = new EmbedBuilder()
        .setColor(colour)
        .setAuthor({ name: nickname, iconURL: avatar })
        .setTitle("Invite")
        .setDescription(
          `Would you like to **invite <@${botID}>** to a server,
        or share **${guildName}'s invite link**?`,
        );

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId("bot").setLabel(botName).setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("guild").setLabel(guildName).setStyle(ButtonStyle.Primary),
      );
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });

      let guildInvite = "https://discord.gg/";
      interaction.guild.fetchVanityData().then((i) => {
        guildInvite = guildInvite.concat(i.code || invite);
      });

      const filter = (i: any) => i.user.id === interaction.user.id;
      const collector = interaction.channel!.createMessageComponentCollector({ filter, max: 1, time: 60000 });

      collector.on("collect", async (i) => {
        if (i.customId === "bot") {
          return i.update({ embeds: [], components: [botInvite] });
        } else if (i.customId === "guild") {
          return i.update({ content: guildInvite, embeds: [], components: [] });
        }
      });
    } else {
      return interaction.reply({ embeds: [], components: [botInvite] });
    }
  },
};
