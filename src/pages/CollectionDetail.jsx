import { useParams, useNavigate } from 'react-router-dom'
import { useCollectionsStore } from '../store/collectionsStore'
import { useState } from 'react'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { collections, items, addItem, deleteItem } = useCollectionsStore()
  const collection = collections.find(col => col.id === id)
  const collectionItems = items
    .map((item, idx) => ({ ...item, _idx: idx }))
    .filter(item => item.collectionId === id)

  // View mode: list, grid, gallery
  const [viewMode, setViewMode] = useState('list')

  // Form state: dynamic fields based on collection.fields
  const initialForm = (collection?.fields || []).reduce((acc, f) => ({ ...acc, [typeof f === 'string' ? f : f.name]: '' }), {})
  const [form, setForm] = useState(initialForm)

  const handleAdd = () => {
    // Require at least one field to be filled
    if (!Object.values(form).some(v => v && v.toString().trim())) return
    addItem({ collectionId: id, data: { ...form } })
    setForm(initialForm)
  }

  if (!collection) {
    return (
      <div className="p-4">
        <p className="text-red-500">Collection not found.</p>
        <button className="mt-4 text-blue-600 underline" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button className="mb-4 text-blue-600 underline" onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold mb-2">{collection.name}</h2>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <div className="flex gap-2">
          <button
            className={`px-2 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('list')}
          >List</button>
          <button
            className={`px-2 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('grid')}
          >Grid</button>
          <button
            className={`px-2 py-1 rounded ${viewMode === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('gallery')}
          >Gallery</button>
        </div>
      </div>
      <form className="flex flex-wrap gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleAdd() }}>
        {(collection.fields || []).map(field => {
          const name = typeof field === 'string' ? field : field.name
          const type = typeof field === 'string' ? 'text' : field.type
          return (
            <input
              key={name}
              className="border rounded px-2 py-1 flex-1 min-w-[120px]"
              placeholder={name}
              type={type}
              value={form[name] || ''}
              onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
            />
          )
        })}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Add Item
        </button>
      </form>
      {collectionItems.length === 0 ? (
        <div className="text-gray-500">No items in this collection yet.</div>
      ) : viewMode === 'list' ? (
        <ul className="space-y-2">
          {collectionItems.map((item) => (
            <li key={item._idx} className="bg-white rounded shadow p-3 flex items-center justify-between">
              <div>
                {Object.entries(item.data).map(([field, value]) => (
                  <div key={field} className="text-sm">
                    <span className="font-medium">{field}:</span> {value}
                  </div>
                ))}
              </div>
              <button
                className="text-red-500 hover:underline text-sm ml-4"
                onClick={() => deleteItem(item._idx)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collectionItems.map((item) => (
            <div key={item._idx} className="bg-white rounded shadow p-3 flex flex-col justify-between">
              <div>
                {Object.entries(item.data).map(([field, value]) => (
                  <div key={field} className="text-sm">
                    <span className="font-medium">{field}:</span> {value}
                  </div>
                ))}
              </div>
              <button
                className="text-red-500 hover:underline text-sm mt-2 self-end"
                onClick={() => deleteItem(item._idx)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {collectionItems.map((item) => (
            <div key={item._idx} className="bg-white rounded shadow flex flex-col items-center p-4">
              {/* Gallery: show first field big, rest small */}
              <div className="text-lg font-bold mb-2">
                {Object.values(item.data)[0]}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {Object.keys(item.data)[0]}
              </div>
              <div className="flex flex-col gap-1 w-full">
                {Object.entries(item.data).slice(1).map(([field, value]) => (
                  <div key={field} className="text-xs">
                    <span className="font-medium">{field}:</span> {value}
                  </div>
                ))}
              </div>
              <button
                className="text-red-500 hover:underline text-xs mt-2 self-end"
                onClick={() => deleteItem(item._idx)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
