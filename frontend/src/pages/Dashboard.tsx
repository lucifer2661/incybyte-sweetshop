import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsApi, inventoryApi } from '../lib/api';
import type { Sweet, CreateSweetDto, UpdateSweetDto } from '../lib/api';
import { getStoredUser, clearAuth, isAdmin } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [newSweet, setNewSweet] = useState<CreateSweetDto>({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  });
  const [restockAmount, setRestockAmount] = useState(0);

  const { data: sweets = [], isLoading } = useQuery({
    queryKey: ['sweets', searchParams],
    queryFn: () => {
      const hasSearchParams = Object.values(searchParams).some((v) => v !== '');
      return hasSearchParams
        ? sweetsApi.search(searchParams).then((res) => res.data)
        : sweetsApi.getAll().then((res) => res.data);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSweetDto) => sweetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setShowCreateModal(false);
      setNewSweet({ name: '', category: '', price: 0, quantity: 0 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSweetDto }) =>
      sweetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setShowEditModal(false);
      setSelectedSweet(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sweetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: (id: string) => inventoryApi.purchase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      inventoryApi.restock(id, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setShowRestockModal(false);
      setRestockAmount(0);
      setSelectedSweet(null);
    },
  });

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['sweets', searchParams] });
  };

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setShowEditModal(true);
  };

  const handleRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setShowRestockModal(true);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-purple-600">Sweet Shop</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {user.email} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Sweets Inventory</h2>
          {isAdmin() && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add New Sweet
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={searchParams.minPrice}
              onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Max Price"
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSearch}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{sweet.name}</h3>
                <p className="text-gray-600 mb-2">Category: {sweet.category}</p>
                <p className="text-2xl font-bold text-purple-600 mb-4">${sweet.price.toFixed(2)}</p>
                <p className="text-gray-700 mb-4">
                  Quantity: <span className="font-semibold">{sweet.quantity}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => purchaseMutation.mutate(sweet.id)}
                    disabled={sweet.quantity === 0 || purchaseMutation.isPending}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                  </button>
                  {isAdmin() && (
                    <>
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(sweet.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {sweets.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-600">
            No sweets found. {isAdmin() && 'Create your first sweet!'}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Sweet</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newSweet.name}
                onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Category"
                value={newSweet.category}
                onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                value={newSweet.price}
                onChange={(e) => setNewSweet({ ...newSweet, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                step="0.01"
                min="0"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newSweet.quantity}
                onChange={(e) => setNewSweet({ ...newSweet, quantity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => createMutation.mutate(newSweet)}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Edit Sweet</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={selectedSweet.name}
                onChange={(e) =>
                  setSelectedSweet({ ...selectedSweet, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Category"
                value={selectedSweet.category}
                onChange={(e) =>
                  setSelectedSweet({ ...selectedSweet, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                value={selectedSweet.price}
                onChange={(e) =>
                  setSelectedSweet({ ...selectedSweet, price: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                step="0.01"
                min="0"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={selectedSweet.quantity}
                onChange={(e) =>
                  setSelectedSweet({ ...selectedSweet, quantity: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedSweet.id,
                      data: {
                        name: selectedSweet.name,
                        category: selectedSweet.category,
                        price: selectedSweet.price,
                        quantity: selectedSweet.quantity,
                      },
                    })
                  }
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSweet(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Restock {selectedSweet.name}</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Amount to add"
                value={restockAmount}
                onChange={(e) => setRestockAmount(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    restockMutation.mutate({ id: selectedSweet.id, amount: restockAmount })
                  }
                  disabled={restockMutation.isPending || restockAmount <= 0}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                >
                  Restock
                </button>
                <button
                  onClick={() => {
                    setShowRestockModal(false);
                    setSelectedSweet(null);
                    setRestockAmount(0);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

