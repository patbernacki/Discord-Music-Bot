const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueueRepeatMode } = require('discord-player')
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("loops songs from youtube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("exit")
				.setDescription("Exits out of the current loop")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Starts looping currently playing song")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("queue")
				.setDescription("Starts looping current queue")
		),

	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "exit") {
			await queue.setRepeatMode(QueueRepeatMode.OFF)
			embed
				.setDescription(`Loop is turned off`)
		}

		else if (interaction.options.getSubcommand() === "song") {
			const song = queue.current
			await queue.setRepeatMode(QueueRepeatMode.TRACK)
			embed
				.setDescription(`**[${song.title}](${song.url})** is on loop`)
				.setThumbnail(song.thumbnail)
		} 

		else if (interaction.options.getSubcommand() === "queue") {
			await queue.setRepeatMode(QueueRepeatMode.QUEUE)
			embed
				.setDescription(`Current queue is on loop`)
		}

        await interaction.editReply({
            embeds: [embed]
        })
	},
}