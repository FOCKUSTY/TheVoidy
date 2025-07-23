/* eslint-disable */

import { Debug, Env } from "@voidy/develop";

import type { Interaction } from "discord.js";
import { Collection, MessageFlags } from "discord.js";
import Command from "src/types/command.type";

import type { ModulesType } from "../discord.bot";

export default class Listener {
  public readonly name = "interaction-create";
  public readonly tag = "unique" as const;

  async execute(
    interaction: Interaction,
    modules: ModulesType,
    cooldowns: Collection<any, any>
  ) {
    if (!modules.commands) return;
    if (!interaction.isChatInputCommand()) return;

    const command: Command|undefined = modules.commands.collection.get(interaction.commandName);

    Debug.Log([
      "Запуск команды " + interaction.commandName,
      "\nПользователь " + interaction.user.username
    ]);

    if (!command) {
      return Debug.Warn(`Не найдено команды ${interaction.commandName}.`);
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
          content: `Пожалуйста, подождите откат команды \`/${command.data.name}\`. Вы можете использовать снова через: <t:${expiredTimestamp}:R>.`,
          flags: MessageFlags.Ephemeral
        });
      }
    }

    if (interaction.user.id !== Env.get("AUTHOR_ID")) {
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    try {
      Debug.Log(["Запуск команды " + interaction.commandName]);
      await command.execute(interaction, modules);
    } catch (err) {
      Debug.Error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral
        });
      }
    }
  }
}
