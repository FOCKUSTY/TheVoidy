import { Debug } from "v@develop";
import { Voidy } from "v@types";
import { commands } from "../deploy.commands";
import { lastMessageEquals } from "./message.listener";

const SlashCommandsListener = async (message: Voidy.Telegram.Interaction) => {
  if (!message.text) return;
  if (!message.from) return;
  if (lastMessageEquals(message.chat.id, message)) return;
  if (!message.text.startsWith("/")) return;

  Debug.Log(["Запуск Telegram команды", message.from.username || message.from.first_name]);

  const commandName = message.text.includes(" ")
    ? message.text.slice(1, message.text.indexOf(" "))
    : message.text.slice(1, message.text.length);

  Debug.Log(["Telegram Команда:", commandName]);

  const command = commands.get(commandName);

  if (!command) return Debug.Warn(["Telegram Команда", `"${commandName}"`, "не была найдена"]);

  try {
    command.execute(message);
  } catch (err) {
    Debug.Error(err);
  }
};

export default SlashCommandsListener;
