import Dexie from 'dexie'

export const db = new Dexie('vaultly')
db.version(1).stores({
  collections: 'id',
  items: '++id,collectionId',
})
