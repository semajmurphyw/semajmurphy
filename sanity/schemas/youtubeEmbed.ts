import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'youtubeEmbed',
  title: 'YouTube Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }),
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({ url }: { url?: string }) {
      return {
        title: 'YouTube Video',
        subtitle: url || 'No URL provided',
      }
    },
  },
})

