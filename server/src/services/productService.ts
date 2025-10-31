import { productRepo } from '../repositories/productRepo';

export const productService = {
  async list(params: { q?: string; categoryId?: string; page?: number; limit?: number }) {
    const filter: any = {};
    if (params.q) filter.name = { $regex: params.q, $options: 'i' };
    if (params.categoryId) filter.categoryId = params.categoryId;
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const [items, total] = await Promise.all([
      productRepo.list(filter, page, limit),
      productRepo.count(filter),
    ]);
    return { items, total, page, limit };
  },
  get: (id: string) => productRepo.get(id),
  async create(data: any) {
    const exists = await productRepo.getBySKU(data.sku);
    if (exists) throw new Error('SKU must be unique');
    return productRepo.create(data);
  },
  update: (id: string, data: any) => productRepo.update(id, data),
  remove: (id: string) => productRepo.remove(id),
};
