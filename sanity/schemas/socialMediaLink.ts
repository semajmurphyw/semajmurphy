import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'socialMediaLink',
  title: 'Social Media Link',
  type: 'document',
  fields: [
    defineField({
      name: 'platformName',
      title: 'Platform Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload an icon for the social media platform',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'platformName',
      media: 'icon',
    },
  },
})

