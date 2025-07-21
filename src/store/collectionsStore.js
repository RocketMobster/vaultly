import { db } from './db'
import { create } from 'zustand'

export const useCollectionsStore = create((set, get) => ({
  collections: [],
  items: [],

  setCollections: (collections) => set({ collections }),
  setItems: (items) => set({ items }),

  addCollection: (collection) => {
    db.collections.add(collection).then(() => {
      set((state) => ({ collections: [...state.collections, collection] }))
    })
  },

  updateCollection: (id, updates) => {
    db.collections.update(id, updates).then(() => {
      set((state) => ({
        collections: state.collections.map((col) =>
          col.id === id ? { ...col, ...updates } : col
        ),
      }))
    })
  },

  deleteCollection: (id) => {
    Promise.all([
      db.collections.delete(id),
      db.items.where('collectionId').equals(id).delete()
    ]).then(() => {
      set((state) => ({
        collections: state.collections.filter((col) => col.id !== id),
        items: state.items.filter((item) => item.collectionId !== id),
      }))
    })
  },

  addItem: (item) => {
    db.items.add(item).then(() => {
      set((state) => ({ items: [...state.items, item] }))
    })
  },

  updateItem: (index, updates) => {
    const item = get().items[index]
    if (item) {
      db.items.update(item.id, updates).then(() => {
        set((state) => ({
          items: state.items.map((it, i) =>
            i === index ? { ...it, ...updates } : it
          ),
        }))
      })
    }
  },

  deleteItem: (index) => {
    const item = get().items[index]
    if (item) {
      db.items.delete(item.id).then(() => {
        set((state) => ({ items: state.items.filter((_, i) => i !== index) }))
      })
    }
  },
}))

// Load from IndexedDB on app start
;(async () => {
  const collections = await db.collections.toArray()
  const items = await db.items.toArray()
  useCollectionsStore.getState().setCollections(collections)
  useCollectionsStore.getState().setItems(items)
})()
