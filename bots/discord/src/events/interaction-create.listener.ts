/* eslint-disable */

import { Debug, Env } from "v@develop";

import type { Interaction } from "discord.js";
import { Collection } from "discord.js";

export default class Listener {
  public readonly name = "interaction-create";

  async execute(
    interaction: Interaction,
    commands: Collection<any, any>,
    cooldowns: Collection<any, any>
  ) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    Debug.Log([
      "Запуск команды " + interaction.commandName,
      "\nПользователь " + interaction.user.username
    ]);

    if (!command) {
      return Debug.Warn(`Не найдено команды ${interaction.commandName}`);
    }

    if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id) && interaction.user.id !== Env.get("AUTHOR_ID")) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return interaction.reply({
          content: `Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true
        });
      }
    }

    if (interaction.user.id !== Env.get("AUTHOR_ID")) {
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    try {
      Debug.Log(["Запуск команды " + interaction.commandName]);
      await command.execute(interaction);
    } catch (err) {
      Debug.Error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true
        });
      }
    }
  }
}
