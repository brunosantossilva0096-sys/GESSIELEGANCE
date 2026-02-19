import { db } from './database';
import { auth } from './auth';
import { cartService } from './cart';
import { emailService } from './email';
import type { StoreConfig } from '../types';

const STORE_CONFIG_KEY = 'vendapro_config';

const defaultStoreConfig: StoreConfig = {
  id: 'default',
  name: 'VendaPro Moda',
  description: 'Moda elegante e sofisticada para todas as ocasiões',
  contactEmail: 'contato@vendapro.com.br',
  contactPhone: '(11) 99999-9999',
  paymentConfig: {
    pixEnabled: true,
    creditCardEnabled: true,
    debitCardEnabled: true,
    boletoEnabled: false,
    maxInstallments: 6,
    minInstallmentValue: 50,
  },
  shippingConfig: {
    defaultMethod: 'ship-1',
    zipOrigin: '01001-000',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function initializeServices(): Promise<void> {
  // Initialize database
  await db.init();

  // Seed initial data if needed
  await db.seedInitialData();

  // Initialize auth
  await auth.init();

  // Initialize cart
  const currentUser = auth.getCurrentUser();
  cartService.init(currentUser?.id);

  // Initialize email service
  const storeConfig = await db.getStoreConfig();
  if (storeConfig) {
    emailService.configure(storeConfig.name, storeConfig.contactEmail);
  } else {
    // Save default config
    await db.saveStoreConfig(defaultStoreConfig);
    emailService.configure(defaultStoreConfig.name, defaultStoreConfig.contactEmail);
  }

  console.log('✅ VendaPro services initialized');
}

export async function getStoreConfig(): Promise<StoreConfig> {
  const config = await db.getStoreConfig();
  return config || defaultStoreConfig;
}

export async function updateStoreConfig(config: Partial<StoreConfig>): Promise<void> {
  const current = await getStoreConfig();
  const updated = { ...current, ...config, updatedAt: new Date().toISOString() };
  await db.saveStoreConfig(updated);

  // Update email service if store info changed
  if (config.name || config.contactEmail) {
    emailService.configure(updated.name, updated.contactEmail);
  }
}
