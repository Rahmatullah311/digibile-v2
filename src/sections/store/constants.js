import { z as zod } from 'zod';

export const StoreCreateSchema = zod.object({
  owner_id: zod.number({
    required_error: 'Owner is required',
    invalid_type_error: 'Owner must be a valid user',
  }),

  name: zod.string().min(1, 'Name is required').max(255, 'Name is too long'),

  slug: zod
    .string()
    .min(1, 'Slug is required')
    .max(50)
    .regex(/^[-a-zA-Z0-9_]+$/, 'Invalid slug format'),

  description: zod.string().optional(),
  logo: zod.any().optional(),
  banner: zod.any().optional(),

  email: zod.string().email().optional(),
  email_verified: zod.boolean().optional(),

  phone: zod.string().max(20).optional(),
  phone_verified: zod.boolean().optional(),

  website: zod.string().url().optional(),

  address: zod.string().optional(),

  facebook: zod.string().url().optional(),
  instagram: zod.string().url().optional(),
  twitter: zod.string().url().optional(),

  status: zod.enum(['pending', 'active', 'suspended', 'rejected']),

  is_featured: zod.boolean().optional(),

  seo_title: zod.string().max(255).optional(),
  seo_description: zod.string().optional(),

  verified: zod.boolean().nullable().optional(),
});

export const StoreCreateInitialValues = (defaultValue = {}) => ({
  owner_id: defaultValue?.owner?.id || defaultValue?.owner_id || null,

  name: defaultValue?.name || '',
  slug: defaultValue?.slug || '',
  description: defaultValue?.description || '',

  logo: defaultValue?.logo || null,
  banner: defaultValue?.banner || null,

  email: defaultValue?.email || '',
  email_verified: defaultValue?.email_verified ?? false,

  phone: defaultValue?.phone || '',
  phone_verified: defaultValue?.phone_verified ?? false,

  website: defaultValue?.website || '',
  address: defaultValue?.address || '',

  facebook: defaultValue?.facebook || '',
  instagram: defaultValue?.instagram || '',
  twitter: defaultValue?.twitter || '',

  status: defaultValue?.status || 'pending',
  is_featured: defaultValue?.is_featured ?? false,

  seo_title: defaultValue?.seo_title || '',
  seo_description: defaultValue?.seo_description || '',

  verified: defaultValue?.verified ?? null,
});

export const STORE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected',
};

export const STORE_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Rejected', value: 'rejected' },
];
