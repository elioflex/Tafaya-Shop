import React from 'react'
import { Package, Eye, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'

const AdminDashboard = ({ products, orders = [] }) => {
  const totalProducts = products.length

  // Inventory Value
  const inventoryValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)

  // Order Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const lowStockCount = products.filter(p => p.stock !== null && p.stock !== undefined && p.stock <= 3 && p.stock >= 0).length
  const outOfStockCount = products.filter(p => p.stock !== null && p.stock !== undefined && p.stock <= 0).length

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `${totalRevenue.toLocaleString()} MAD`,
      color: 'bg-green-500'
    },
    {
      icon: Package,
      label: 'Total Orders',
      value: `${totalOrders} (${pendingOrders} new)`,
      color: 'bg-blue-500'
    },
    {
      icon: TrendingUp,
      label: 'Inventory Value',
      value: `${inventoryValue.toLocaleString()} MAD`,
      color: 'bg-purple-500'
    },
    {
      icon: AlertTriangle,
      label: 'Low Stock',
      value: `${lowStockCount} (${outOfStockCount} out)`,
      color: lowStockCount > 0 ? 'bg-orange-500' : 'bg-gray-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-4 rounded-xl`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard

