import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
dotenv.config();

import { QuickDB, JSONDriver } from "quick.db";
const jsonDriver = new JSONDriver("database.json");
const db = new QuickDB({ driver: jsonDriver });
import config from "./config.js";

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.commands = new Collection();
client.db = db;
client.config = config;

const commandFiles = fs
  .readdirSync("./commands")
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const commandsArray = client.commands.map((cmd) => cmd.data.toJSON());

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commandsArray },
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const eventFiles = fs.readdirSync("./events").filter((f) => f.endsWith(".js"));
for (const file of eventFiles) {
  const { default: event } = await import(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.TOKEN);
