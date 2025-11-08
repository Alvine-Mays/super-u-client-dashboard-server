import { categoryRepo } from '../repositories/categoryRepo';

export const categoryService = {
  async list(params: { page?: number; limit?: number }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const [items, total] = await Promise.all([
      categoryRepo.list({}, page, limit),
      categoryRepo.count({}),
    ]);
    return { items, total, page, limit };
  },
  get: (id: string) => categoryRepo.get(id),
  create: (data: any) => categoryRepo.create(data),
  update: (id: string, data: any) => categoryRepo.update(id, data),
  remove: (id: string) => categoryRepo.remove(id),
};
