/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { nicknameCheck } from "../../util/nicknameCheck";
import { colour } from "../../config/config.json";
import axios from "axios";
import currencies from "../../data/currencies.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("convert")
    .setDescription("Convert from one currency to another.")
    .addNumberOption((option: any) =>
      option.setName("value").setDescription("The value of the currency you're converting from.").setRequired(true),
    )
    .addStringOption((option: any) =>
      option
        .setName("fromcurrency")
        .setDescription("The three-letter currency code of the currency you would like to convert from.")
        .setRequired(true),
    )
    .addStringOption((option: any) =>
      option
        .setName("tocurrency")
        .setDescription("The three-letter currency code of the currency you would like to convert to.")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getNumber("value");
    const fromCurrency = interaction.options.getString("fromcurrency")!.toUpperCase();
    const toCurrency = interaction.options.getString("tocurrency")!.toUpperCase();

    if (
      currencies.includes(toCurrency) &&
      currencies.includes(fromCurrency) &&
      toCurrency !== fromCurrency &&
      value! > 0
    ) {
      axios
        .get(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${value}`)
        .then(async (res: any) => {
          const avatar = nicknameCheck(interaction).avatar;
          const nickname = nicknameCheck(interaction).nickname;

          const newValue = res.data.result.toFixed(2);

          const embed = new EmbedBuilder()
            .setColor(colour)
            .setAuthor({ name: `💰 ${value} ${fromCurrency} equals:` })
            .setTitle(`${newValue} ${toCurrency}`)
            .setFooter({ text: nickname, iconURL: avatar })
            .setTimestamp();

          return interaction.reply({ embeds: [embed] });
        })
        .catch(() => {
          return interaction.reply({ content: "The API returned an error; Please try again!", ephemeral: true });
        });
    } else {
      return interaction.reply({ content: "Invalid request.", ephemeral: true });
    }
  },
};
