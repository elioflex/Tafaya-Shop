import React from 'react'
import { Package, Eye, TrendingUp, DollarSign } from 'lucide-react'

const AdminDashboard = ({ products }) => {
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
  const avgPrice = totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0

  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: totalProducts,
      color: 'bg-blue-500'
    },
    {
      icon: DollarSign,
      label: 'Total Value',
      value: `${totalValue.toFixed(0)} MAD`,
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Average Price',
      value: `${avgPrice} MAD`,
      color: 'bg-purple-500'
    },
    {
      icon: Eye,
      label: 'Published',
      value: totalProducts,
      color: 'bg-orange-500'
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
