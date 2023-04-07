/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour } from "../../config/config.json";

const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder().setName("emojiauth").setDescription("Change your settings for global emoji use."),
  async execute(interaction: ChatInputCommandInteraction) {
    const avatar = nicknameCheck(interaction).avatar;
    const nickname = nicknameCheck(interaction).nickname;

    const defaultEmbed = new EmbedBuilder()
      .setColor(colour)
      .setAuthor({ name: nickname, iconURL: avatar })
      .setTimestamp();

    if (interaction.inGuild()) {
      const user = await interaction.guild!.members.cache.find((user) => user.id === interaction.user.id)!;
      const guildId = interaction.guild!.id;

      const blacklist = await prisma.blacklist.findMany();
      let blacklisted = false;

      blacklist.forEach((u) => {
        if (u.userId === interaction.user.id || u.userId === interaction.guild!.ownerId) {
          blacklisted = true;
        }
      });

      if (user !== undefined && user.permissions.has(PermissionFlagsBits.ManageGuild) && !blacklisted) {
        const guild = await prisma.auth.findUnique({
          where: {
            guildId: guildId,
          },
        });

        let response: string;
        if (guild!.authentication === true) {
          response = "in** to";
        } else {
          response = "out** of";
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("in").setLabel("Opt-In").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("out").setLabel("Opt-Out").setStyle(ButtonStyle.Primary),
        );
        await interaction.reply({
          embeds: [
            defaultEmbed
              .setTitle("Global Emoji Sharing")
              .setDescription(
                `You are currently **opted-${response} global emoji sharing.\nTo change your settings, react below!`,
              ),
          ],
          ephemeral: true,
          components: [row],
        });

        const filter = (i: any) => i.user.id === interaction.user.id;
        const collector = interaction.channel!.createMessageComponentCollector({ filter, max: 1, time: 60000 });

        collector.on("collect", async (i) => {
          if (
            (guild!.authentication === true && i.customId === "out") ||
            (guild!.authentication === false && i.customId === "in")
          ) {
            if (i.customId === "out") {
              await prisma.auth.update({
                where: {
                  guildId: guildId,
                },
                data: {
                  authentication: false,
                },
              });
            } else if (i.customId === "in") {
              await prisma.auth.update({
                where: {
                  guildId: guildId,
                },
                data: {
                  authentication: true,
                },
              });
            }
            return i.update({
              embeds: [
                defaultEmbed
                  .setTitle("Changes Confirmed")
                  .setDescription("Note that you can change these settings at any time by using `/emojiauth`!"),
              ],
              components: [],
            });
            /* to-do: update emoji map
            updateMap(this.client);*/
          } else {
            return i.update({
              embeds: [defaultEmbed.setTitle("Cancelled Command").setDescription("No changes made.")],
              components: [],
            });
          }
        });
      } else {
        interaction.reply({
          embeds: [
            defaultEmbed
              .setTitle("Insufficient Permissions")
              .setDescription("You are not authorised to use this command."),
          ],
          ephemeral: true,
        });
      }
    } else {
      interaction.reply(
        "This command cannot be run from DMs — Try again in a server you have the `Manage Server` permission in!",
      );
    }
  },
};
