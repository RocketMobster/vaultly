import { useParams, useNavigate } from 'react-router-dom';
import { useCollectionsStore } from '../store/collectionsStore';
import { useState } from 'react';

export default function CollectionDetail() {
  // Track raw input for tags fields
  const [rawTagsInput, setRawTagsInput] = useState({});

  // ...existing CollectionDetail code (all logic, state, rendering) goes here...

  // Helper to render correct input for each field type
  const renderFieldInput = (field, value, onChange, fieldKey, isEdit = false) => {
    const name = typeof field === 'string' ? field : field.name;
    const type = typeof field === 'string' ? 'text' : field.type;
    if (type === 'dropdown' && field.options) {
      return (
        <>
          <label className="block text-xs text-gray-500 mb-1">{name}</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </>
      );
    }
    if (type === 'tags') {
      // Use fieldKey to track raw input for each tags field
      return (
        <div className="w-full block">
          <label className="block text-xs text-gray-500 mb-1">{name}</label>
          <input
            className="border rounded px-2 py-1 w-full"
            type="text"
            placeholder="Comma separated tags"
            value={rawTagsInput[fieldKey] !== undefined ? rawTagsInput[fieldKey] : (Array.isArray(value) ? value.join(', ') : value || '')}
            onChange={e => {
              setRawTagsInput(prev => ({ ...prev, [fieldKey]: e.target.value }));
            }}
            onBlur={e => {
              const raw = e.target.value;
              const tags = raw.split(',').map(t => t.trim().replace(/ /g, '_')).filter(Boolean);
              onChange(tags);
              setRawTagsInput(prev => ({ ...prev, [fieldKey]: tags.join(', ') }));
            }}
          />
        </div>
      );
    }
    if (type === 'image') {
      return (
        <>
          <label className="block text-xs text-gray-500 mb-1">{name}</label>
          <input
            className="border rounded px-2 py-1 w-full min-w-[220px]"
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => onChange(ev.target.result);
                reader.readAsDataURL(file);
              }
            }}
          />
        </>
      );
    }
    // Default: text, number, date
    return (
      <>
        <label className="block text-xs text-gray-500 mb-1">{name}</label>
        <input
          className="border rounded px-2 py-1 w-full"
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      </>
    );
  };
  // ...existing code...
// ...existing code above...

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
          const name = typeof field === 'string' ? field : field.name;
          return (
            <div key={name} className={field.type === 'tags' ? 'w-full' : 'flex-1 min-w-[120px]'}>
              {renderFieldInput(field, form[name], val => setForm(f => ({ ...f, [name]: val })), name)}
              {/* Image preview for new item */}
              {field.type === 'image' && form[name] && (
                <img src={form[name]} alt="preview" className="mt-2 max-h-24 rounded border" />
              )}
            </div>
          );
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
                {editingIdx === item._idx ? (
                  <form className="flex flex-wrap gap-2" onSubmit={e => {
                    e.preventDefault();
                    updateItem(item._idx, { data: editForm });
                    setEditingIdx(null);
                  }}>
                    {(collection.fields || []).map(field => {
                      const name = typeof field === 'string' ? field : field.name;
                      return (
                        <div key={name} className={field.type === 'tags' ? 'w-full' : 'min-w-[100px]'}>
                          {renderFieldInput(field, editForm[name], val => setEditForm(f => ({ ...f, [name]: val })), name, true)}
                          {/* Image preview for edit */}
                          {field.type === 'image' && editForm[name] && (
                            <img src={editForm[name]} alt="preview" className="mt-2 max-h-24 rounded border" />
                          )}
                        </div>
                      );
                    })}
                    <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded ml-2">Save</button>
                    <button type="button" className="ml-2 text-gray-500 hover:underline" onClick={() => setEditingIdx(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    {Object.entries(item.data).map(([field, value]) => {
                      const fieldDef = (collection.fields || []).find(f => (typeof f === 'string' ? f : f.name) === field);
                      if (fieldDef?.type === 'image' && value) {
                        return <div key={field} className="text-sm"><span className="font-medium">{field}:</span><br /><img src={value} alt="preview" className="mt-1 max-h-24 rounded border" /></div>;
                      }
                      if (fieldDef?.type === 'tags' && Array.isArray(value)) {
                        return <div key={field} className="text-sm"><span className="font-medium">{field}:</span> {value.join(', ')}</div>;
                      }
                      return <div key={field} className="text-sm"><span className="font-medium">{field}:</span> {value}</div>;
                    })}
                  </>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {editingIdx === item._idx ? null : (
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => {
                      setEditingIdx(item._idx);
                      setEditForm({ ...item.data });
                    }}
                  >Edit</button>
                )}
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => deleteItem(item._idx)}
                >Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collectionItems.map((item) => (
            <div key={item._idx} className="bg-white rounded shadow p-3 flex flex-col justify-between">
              <div>
                {editingIdx === item._idx ? (
                  <form className="flex flex-wrap gap-2" onSubmit={e => {
                    e.preventDefault();
                    updateItem(item._idx, { data: editForm });
                    setEditingIdx(null);
                  }}>
                    {(collection.fields || []).map(field => {
                      const name = typeof field === 'string' ? field : field.name;
                      const type = typeof field === 'string' ? 'text' : field.type;
                      return (
                        <input
                          key={name}
                          className="border rounded px-2 py-1 min-w-[100px]"
                          type={type}
                          value={editForm[name] || ''}
                          onChange={e => setEditForm(f => ({ ...f, [name]: e.target.value }))}
                        />
                      );
                    })}
                    <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded ml-2">Save</button>
                    <button type="button" className="ml-2 text-gray-500 hover:underline" onClick={() => setEditingIdx(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    {Object.entries(item.data).map(([field, value]) => (
                      <div key={field} className="text-sm">
                        <span className="font-medium">{field}:</span> {value}
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-2 self-end">
                {editingIdx === item._idx ? null : (
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => {
                      setEditingIdx(item._idx);
                      setEditForm({ ...item.data });
                    }}
                  >Edit</button>
                )}
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => deleteItem(item._idx)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {collectionItems.map((item) => (
            <div key={item._idx} className="bg-white rounded shadow flex flex-col items-center p-4">
              {editingIdx === item._idx ? (
                <form className="flex flex-col gap-2 w-full items-center" onSubmit={e => {
                  e.preventDefault();
                  updateItem(item._idx, { data: editForm });
                  setEditingIdx(null);
                }}>
                  {(collection.fields || []).map(field => {
                    const name = typeof field === 'string' ? field : field.name;
                    const type = typeof field === 'string' ? 'text' : field.type;
                    return (
                      <input
                        key={name}
                        className="border rounded px-2 py-1 min-w-[100px]"
                        type={type}
                        value={editForm[name] || ''}
                        onChange={e => setEditForm(f => ({ ...f, [name]: e.target.value }))}
                      />
                    );
                  })}
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                    <button type="button" className="text-gray-500 hover:underline" onClick={() => setEditingIdx(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
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
                </>
              )}
              <div className="flex gap-2 mt-2 self-end">
                {editingIdx === item._idx ? null : (
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    onClick={() => {
                      setEditingIdx(item._idx);
                      setEditForm({ ...item.data });
                    }}
                  >Edit</button>
                )}
                <button
                  className="text-red-500 hover:underline text-xs"
                  onClick={() => deleteItem(item._idx)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
