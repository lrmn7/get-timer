import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { format, differenceInMilliseconds, formatDistance } from "date-fns";
import { nl } from "date-fns/locale/index.js";
import ms from "millisecond";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const timers = [];

const commands = [
  {
    name: "60",
    description: "Sets a timer for 60 minutes",
  },
  {
    name: "50",
    description: "Sets a timer for 50 minutes",
  },
  {
    name: "40",
    description: "Sets a timer for 40 minutes",
  },
  {
    name: "30",
    description: "Sets a timer for 30 minutes",
  },
  {
    name: "20",
    description: "Sets a timer for 20 minutes",
  },
  {
    name: "15",
    description: "Sets a timer for 15 minutes",
  },
  {
    name: "10",
    description: "Sets a timer for 10 minutes",
  },
  {
    name: "5",
    description: "Sets a timer for 5 minutes",
  },
  {
    name: "1",
    description: "Sets a timer for 1 minute",
  },
];

let prefixList = ["!setTimer "];

function hasPrefix(str) {
  for (let pre of prefixList) if (str.startsWith(pre)) return true;
  return false;
}

function removePrefix(str) {
  for (let pre of prefixList) {
    if (str.startsWith(pre)) {
      return str.slice(pre.length);
    }
  }
  return str;
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return false; // If the message is sent by a bot, we ignore it.

  if (hasPrefix(message.content)) {
    var parsedDate = Date.parse(removePrefix(message.content));

    if (isNaN(parsedDate)) {
      console.log(
        `Date is not in a valid format: use the following format: ${format(
          new Date(),
          "dd MMM yyyy kk:mm:00 O"
        )}`
      );

      message.reply(
        `Date is not in a valid format: use the following format: ${format(
          new Date(),
          "dd MMM yyyy kk:mm:00 O"
        )}`
      );
      return;
    }

    var millisecondsUntil = millisecondsUntilTimestamp(
      parsedDate,
      message.createdTimestamp
    );

    if (millisecondsUntil < 0) {
      console.log("Can't set a timer for a date in the past");
      message.reply("Can't set a timer for a date in the past");
      return;
    }

    message.reply("Timer has been set for " + durationUntil(millisecondsUntil));
    createTimerCommand(null, millisecondsUntil, message);
  }
});

async function sendMessage(channelId, message) {
  const channel = await client.channels.fetch(channelId);

  // channel type 0 means text channel
  if (channel && channel.type === 0) {
    // Send the message
    channel.send(message);
  } else {
    console.log(`Channel with ID ${channelId} not found.`);
  }
}

function durationUntil(millisecond) {
  return formatDistance(0, millisecond, { includeSeconds: true });
}

function millisecondsUntilTimestamp(targetTimestamp, currentTimestamp) {
  return differenceInMilliseconds(targetTimestamp, currentTimestamp);
}

function createTimerCommand(interaction, time, message) {
  setTimeout(async function () {
    if (interaction) {
      // Send the followUp
      interaction.followUp(
        `<@${interaction.user.id}>'s timer for ${durationUntil(
          time
        )} created at  ${format(interaction.createdAt, "HH:mm dd/LL/yyyy", {
          locale: nl,
        })} is done!`
      );
    } else if (message) {
      // Send the message
      message.reply(
        `<@${message.author.id}>'s timer for ${durationUntil(
          time
        )} created at  ${format(message.createdTimestamp, "HH:mm dd/LL/yyyy", {
          locale: nl,
        })} is done!`
      );
    }
  }, time);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "1") {
    createTimerCommand(interaction, ms("1 minute"));

    await interaction.reply("Timer has been set for 1 minute");
  }
  if (interaction.commandName === "5") {
    createTimerCommand(interaction, ms("5 minutes"));

    await interaction.reply("Timer has been set for 5 minutes");
  }
  if (interaction.commandName === "10") {
    createTimerCommand(interaction, ms("10 minutes"));

    await interaction.reply("Timer has been set for 10 minutes");
  }
  if (interaction.commandName === "15") {
    createTimerCommand(interaction, ms("15 minutes"));

    await interaction.reply("Timer has been set for 15 minutes");
  }
  if (interaction.commandName === "20") {
    createTimerCommand(interaction, ms("20 minutes"));

    await interaction.reply("Timer has been set for 20 minutes");
  }
  if (interaction.commandName === "30") {
    createTimerCommand(interaction, ms("30 minutes"));

    await interaction.reply("Timer has been set for 30 minutes");
  }
  if (interaction.commandName === "40") {
    createTimerCommand(interaction, ms("40 minutes"));

    await interaction.reply("Timer has been set for 40 minutes");
  }
  if (interaction.commandName === "50") {
    createTimerCommand(interaction, ms("50 minutes"));

    await interaction.reply("Timer has been set for 50 minutes");
  }
  if (interaction.commandName === "60") {
    createTimerCommand(interaction, ms("60 minutes"));

    await interaction.reply("Timer has been set for 60 minutes");
  }
});

client.on("ready", () => {
  console.log("Max Timer is ready!");
});

client.login(process.env.TOKEN);
