import { Types } from "@voidy/types";
import { Debug } from "@voidy/develop";

import { FullPresets } from "@voidy/types/dist/services/news-pattern.type";
import { Telegraf, Format } from "telegraf";

import { Message } from "telegraf/typings/core/types/typegram";

import SendMessage from "./helpers/send-message.helper";
import GetChatId from "./helpers/get-chat-id.helper";
import { format } from "date-fns";

import Client from "../../telegram.bot";
import { BranchCommit, Commit } from "@voidy/types/dist/services/github-api.type";

import { Interaction } from "types/interaction.type";

class Telegram extends Types.Telegram.Service {
  private readonly _client: Telegraf = Client;

  private ToFormattedVisualisation({
    name,
    pattern,
    patternName,
    link
  }: {
    name: string;
    pattern: string;
    patternName: string;
    link: string;
  }) {
    return pattern.replaceAll(patternName, !link ? name : `[${name}](${link})`) + "\n";
  }

  public Format = ({
    repos,
    pattern,
    linkEnabled
  }: {
    repos: { [key: string]: { link: string; commits: BranchCommit[] } };
    pattern: FullPresets;
    linkEnabled: boolean;
  }): string => {
    let output: string = "";

    for (const repo of Object.keys(repos)) {
      const { link, commits } = repos[repo];

      output += this.ToFormattedVisualisation({
        link: linkEnabled ? link : "",
        patternName: "REPO_NAME",
        name: repo,
        pattern: pattern.visualisation.repos
      });

      if (!Array.isArray(commits)) continue;

      const sortedCommits = Object.fromEntries(
        commits.map((commit) => [
          format(new Date(commit.commit.author.date), "yyyy.MM.dd"),
          {
            branch: commit.branch_name,
            date: format(new Date(commit.commit.author.date), "dd.MM.yyyy"),
            data: commit
          }
        ])
      );

      let lastbranch = "";
      for (const key in sortedCommits) {
        const { date, data: commit, branch } = sortedCommits[key];

        if (lastbranch !== branch)
          output += this.ToFormattedVisualisation({
            link: "",
            name: branch,
            pattern: pattern.visualisation.branches,
            patternName: "BRANCH_NAME"
          });

        output += this.ToFormattedVisualisation({
          name: date,
          link: "",
          pattern: pattern.visualisation.dates,
          patternName: "DATE"
        });

        output += this.ToFormattedVisualisation({
          link: linkEnabled ? commit.html_url : "",
          patternName: "COMMIT_NAME",
          name: commit.commit.message.split("\n")[0],
          pattern: pattern.visualisation.commits
        });

        lastbranch = branch;
      }
    }

    return output.replaceAll("\\\\", "\\");
  };

  public Send = async (
    chatId: number | string,
    message: string | Format.FmtString
  ): Promise<Types.Response<string | Message.TextMessage>> => {
    if (!this._client) {
      return {
        data: Debug.Error("Client is not defined"),
        text: "Client is not defined",
        type: 0
      };
    }

    try {
      return {
        data: await Client.telegram.sendMessage(chatId, message),
        text: "Сообщение было отправлено",
        type: 1
      };
    } catch (error) {
      Debug.Error(error);

      return {
        data: error as string,
        text: "Не удалось отправить сообщение",
        type: 0
      };
    }
  };

  public SendAnonMessage = async (
    chatId: string,
    message: string | string[],
    userId: string
  ): Promise<
    Types.Response<
      string | undefined | { text: string; data: Message.TextMessage; userId: string | number }
    >
  > => {
    if (!this._client) {
      return {
        data: Debug.Error("Client is not defined"),
        text: "Client is not defined",
        type: 0
      };
    }

    if (chatId === userId)
      return {
        data: undefined,
        text: "Вы не можете отправить сообщение самому себе",
        type: 0
      };

    const link = `https://t.me/TheVoid_VBOT?start=send_anonimus_message-${chatId}`;
    const intro = "Спасибо, что пользуетесь The Void !";
    const main = "Вы можете ответить, но только один раз !";
    const conc = `Вы можете получать анонимные сообщение по ссылке:\n${link}`;

    let text: string = "";

    if (Array.isArray(message)) for (const msg of message) text += `\n${msg}`;
    else text = message;

    try {
      const txt = Format.code(`${intro}\n\n${text}\n\n${main}\n${conc}`);

      if (txt.entities)
        txt.entities[0] = {
          offset: intro.length + 2,
          length: text.length,
          type: "code"
        };

      const data = await Client.telegram.sendMessage(`${chatId}`, txt);

      return {
        data: { text, data, userId },
        text: "Сообщение успешно отправлено",
        type: 1
      };
    } catch (error) {
      return {
        data: error as string,
        text: "Сообщение не было доставлено",
        type: 0
      };
    }
  };

  public SendMessage = async (
    chatId: number | string,
    message: string | string[]
  ): Promise<Types.Response<string | Message.TextMessage>> => {
    if (!this._client) {
      return {
        data: Debug.Error("Client is not defined"),
        text: "Client is not defined",
        type: 0
      };
    }

    return {
      data: await SendMessage(this._client, chatId, message),
      text: "Сообщение успешно отправлено",
      type: 1
    };
  };

  public GetChatId = async (
    message: Interaction
  ): Promise<Types.Response<string | number>> => {
    return {
      data: await GetChatId(message),
      text: "Сообщение успешно отправлено",
      type: 1
    };
  };

  get client(): Telegraf {
    return this._client;
  }
}

export default Telegram;
