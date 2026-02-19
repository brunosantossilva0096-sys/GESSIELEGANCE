import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import type { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string, colorName?: string) => void;
  onRemove: (productId: string, size?: string, colorName?: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onContinueShopping,
}) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.promotionalPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nenhum item.</p>
          <button
            onClick={onContinueShopping}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Explorar Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-blue-600" />
        Seu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color?.name}`}
              className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-100"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>

                {(item.size || item.color) && (
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    {item.size && <span>Tamanho: {item.size}</span>}
                    {item.color && (
                      <span className="flex items-center gap-1">
                        Cor: {item.color.name}
                        <span
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color.hex }}
                        />
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.size, item.color?.name)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-semibold text-sm min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.size, item.color?.name)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    {item.promotionalPrice && item.promotionalPrice < item.price ? (
                      <>
                        <p className="text-sm text-gray-400 line-through">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="font-bold text-blue-600">
                          {formatCurrency(item.promotionalPrice)}
                        </p>
                      </>
                    ) : (
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemove(item.productId, item.size, item.color?.name)}
                className="text-gray-300 hover:text-red-500 p-2 self-start transition-colors"
                title="Remover item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            onClick={onContinueShopping}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 py-2"
          >
            ← Continuar comprando
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-green-600">A calcular</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ou até 6x de {formatCurrency(subtotal / 6)}
              </p>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              Finalizar Compra <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package className="w-4 h-4" />
                <span>Entrega em todo o Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
