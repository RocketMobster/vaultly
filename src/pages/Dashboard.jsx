import { useCollectionsStore } from '../store/collectionsStore'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { collections, addCollection, deleteCollection } = useCollectionsStore()
  const [newName, setNewName] = useState('')
  const [fieldInput, setFieldInput] = useState('')
  const [fieldType, setFieldType] = useState('text')
  const [dropdownOptions, setDropdownOptions] = useState('')
  const [fields, setFields] = useState([])

  const handleAddField = () => {
    const name = fieldInput.trim()
    if (!name || fields.some(f => f.name === name)) return
    let field = { name, type: fieldType }
    if (fieldType === 'dropdown') {
      field.options = dropdownOptions.split(',').map(opt => opt.trim()).filter(Boolean)
    }
    setFields(f => [...f, field])
    setFieldInput('')
    setFieldType('text')
    setDropdownOptions('')
  }

  const handleRemoveField = (name) => {
    setFields(f => f.filter(x => x.name !== name))
  }

  const handleCreateCollection = () => {
    if (!newName.trim() || fields.length === 0) return
    addCollection({ id: Date.now().toString(), name: newName, fields })
    setNewName('')
    setFields([])
    setFieldInput('')
    setFieldType('text')
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Collections</h1>
      <div className="bg-gray-50 border rounded p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">Create New Collection</h2>
        <div className="flex flex-col gap-2 mb-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="Collection name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Field name (e.g. Title, Date Purchased)"
              value={fieldInput}
              onChange={e => setFieldInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddField() } }}
            />
          <select
            className="border rounded px-2 py-1"
            value={fieldType}
            onChange={e => setFieldType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="tags">Tags</option>
            <option value="image">Image</option>
          </select>
          {fieldType === 'dropdown' && (
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Dropdown options (comma separated)"
              value={dropdownOptions}
              onChange={e => setDropdownOptions(e.target.value)}
            />
          )}
            <button
              className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700"
              onClick={handleAddField}
              type="button"
            >
              Add Field
            </button>
          </div>
        </div>
        {fields.length > 0 && (
          <div className="mb-2 text-sm text-gray-700 flex flex-wrap gap-2">
            {fields.map(field => (
              <span key={field.name} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1">
                {field.name} <span className="text-xs text-gray-500">({field.type}{field.type === 'dropdown' && field.options ? ': ' + field.options.join(', ') : ''})</span>
                <button
                  className="ml-1 text-xs text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveField(field.name)}
                  title="Remove field"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleCreateCollection}
          disabled={!newName.trim() || fields.length === 0}
        >
          Create Collection
        </button>
      </div>
      <ul className="space-y-2">
        {collections.length === 0 && (
          <li className="text-gray-500">No collections yet.</li>
        )}
        {collections.map(col => (
          <li key={col.id} className="flex items-center justify-between bg-white rounded shadow p-3">
            <Link to={`/collection/${col.id}`} className="font-medium text-blue-700 hover:underline">
              {col.name}
            </Link>
            <button
              className="text-red-500 hover:underline text-sm"
              onClick={() => deleteCollection(col.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
