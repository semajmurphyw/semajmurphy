import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Biography singleton
      S.listItem()
        .title('Biography')
        .id('biography')
        .child(
          S.document()
            .schemaType('biography')
            .documentId('biography')
        ),
      // Divider
      S.divider(),
      // Other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['biography'].includes(listItem.getId() || '')
      ),
    ])

