import React, { useState } from 'react';
import type { Product, CartItem } from '../types';
import { ShoppingBag, Plus, Check, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState(product.colors.length > 0 ? product.colors[0] : undefined);

  const price = product.promotionalPrice || product.price;
  const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      promotionalPrice: product.promotionalPrice,
      image: product.images[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    setShowOptions(false);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          onClick={onClick}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              -{Math.round((1 - product.promotionalPrice! / product.price) * 100)}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Últimas unidades
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm">
              Esgotado
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        {product.stock > 0 && !showOptions && (
          <button
            onClick={() => setShowOptions(true)}
            className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-blue-700"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">
          {product.category}
        </span>
        <h3
          onClick={onClick}
          className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </div>

        {/* Size Options */}
        {showOptions && product.sizes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Tamanho: <span className="font-medium text-gray-900">{selectedSize}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg border transition-all ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Options */}
        {showOptions && product.colors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Cor: <span className="font-medium text-gray-900">{selectedColor?.name}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor?.name === color.name
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showOptions ? (
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Adicionar
            </button>
            <button
              onClick={() => setShowOptions(false)}
              className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            disabled={product.stock === 0}
            onClick={() => product.stock > 0 && setShowOptions(true)}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
          </button>
        )}
      </div>
    </div>
  );
};
