export type Category = { _id: string; name: string; slug: string; description?: string };
export type Product = { _id: string; id?: string; name: string; price: number; images?: string[] };
export type User = { _id: string; email: string; role: 'customer'|'staff'|'admin'; username?: string; phone?: string };
export type Order = any;
export type OrderWithDetails = any;
export type PickupSlot = any;
export type RatingWithUser = any;
