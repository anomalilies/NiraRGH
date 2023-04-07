/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour } from "../../config/config.json";

const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder().setName("deletefishy").setDescription("Delete your fishing data."),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await interaction.guild!.members.cache.find((user) => user.id === interaction.user.id)!;

    if (user !== undefined) {
      const target = await prisma.fishy.findUnique({
        where: {
          userId: user.user.id,
        },
      });

      const avatar = nicknameCheck(interaction).avatar;
      const nickname = nicknameCheck(interaction).nickname;

      const defaultEmbed = new EmbedBuilder()
        .setColor(colour)
        .setAuthor({ name: nickname, iconURL: avatar })
        .setTimestamp();

      if (target === null) {
        interaction.reply({
          embeds: [defaultEmbed.setTitle("Hold Up!").setDescription("You've never fished before!")],
          ephemeral: true,
        });
      } else {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Primary),
        );
        await interaction.reply({
          embeds: [
            defaultEmbed
              .setTitle("Request Data Deletion")
              .setDescription("Are you sure you'd like to delete your fishy data?\nYou won't be able to recover this!"),
          ],
          ephemeral: true,
          components: [row],
        });

        const filter = (i: any) => i.user.id === interaction.user.id;
        const collector = interaction.channel!.createMessageComponentCollector({ filter, max: 1, time: 60000 });

        collector.on("collect", async (i: any) => {
          if (i.customId === "yes") {
            await prisma.fishy.delete({
              where: {
                userId: user.id,
              },
            });
            return i.update({
              embeds: [
                defaultEmbed
                  .setTitle("Data Deletion Successful")
                  .setDescription("To create new data, simply run `/fishy` again!"),
              ],
              components: [],
            });
          } else if (i.customId === "no") {
            return i.update({
              embeds: [defaultEmbed.setTitle("Cancelled Command").setDescription("No changes made.")],
              components: [],
            });
          }
        });
      }
    }
  },
};
