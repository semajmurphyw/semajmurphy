import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryItems',
      title: 'Gallery Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'photoGallery' }],
        },
      ],
      description: 'Add photo gallery items in the desired order',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})

