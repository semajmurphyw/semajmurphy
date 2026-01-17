import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'biography',
  title: 'Biography',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'oneLiner',
      title: 'One Liner',
      type: 'string',
      description: 'Short one-line description',
    }),
    defineField({
      name: 'bioImage',
      title: 'Bio Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'epkDownload',
      title: 'EPK Download',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Upload the EPK PDF file',
    }),
    defineField({
      name: 'contactImage',
      title: 'Contact Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image displayed on the contact page',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})