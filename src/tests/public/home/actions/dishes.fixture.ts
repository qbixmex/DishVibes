import type { Dish } from '@/shared/interfaces/dish.interface';

export const pizzasCategoryId = '96b43168-2e20-4e17-b96f-b3b265fef9c1';
export const hamburgersCategoryId = '898238e8-b054-479c-a6b8-9dee051937fd';
export const pastasCategoryId = '7be7cbb3-bdd9-4700-8e15-a1da0dde4732';
export const sidesCategoryId = 'e205d6d5-7088-4b8a-b86c-3fa5da0f4367';
export const dessertsCategoryId = '3f5182fa-f9a8-4495-9dd0-c13e7ebd1e72';

/** Mirrors the rows the database would return, in insert order. */
export const createDbDishes = (): Dish[] => [
  {
    id: '986e882b-5137-480c-8c20-00f0126cef2d',
    name: 'Pizza Margherita',
    slug: 'pizza-margherita',
    imageUrl: '/dish-vibes/pizza-margherita.webp',
    description: 'Tomato, mozzarella and basil.',
    price: 12.5,
    featured: true,
    categoryId: pizzasCategoryId,
  },
  {
    id: 'edbd1a18-5bec-4cd8-a194-e42cc59b57f3',
    name: 'Classic Hamburger',
    slug: 'hamburger-classic',
    imageUrl: '/dish-vibes/hamburger-classic.webp',
    description: 'Beef patty, cheddar and pickles.',
    price: 9.9,
    featured: true,
    categoryId: hamburgersCategoryId,
  },
  {
    id: '4575c503-c1e6-4ee1-8f05-cc5974a115b8',
    name: 'Pepperoni Pizza',
    slug: 'pizza-pepperoni',
    imageUrl: '/dish-vibes/pizza-pepperoni.webp',
    description: 'Tomato, mozzarella and pepperoni.',
    price: 14,
    featured: false,
    categoryId: pizzasCategoryId,
  },
  {
    id: 'bb89b249-5d5a-4d99-9ad3-e37ffa1affd5',
    name: 'Pasta Carbonara',
    slug: 'pasta-carbonara',
    imageUrl: '/dish-vibes/pasta-carbonara.webp',
    description: 'Spaghetti, egg yolk, pecorino and pancetta.',
    price: 13.5,
    featured: true,
    categoryId: pastasCategoryId,
  },
  {
    id: '9ab7bb5c-b3bb-4599-bf1b-8e99ff0d555f',
    name: 'Double Hamburger',
    slug: 'hamburger-double',
    imageUrl: '/dish-vibes/hamburger-double.webp',
    description: 'Two beef patties, cheddar and pickles.',
    price: 15,
    featured: false,
    categoryId: hamburgersCategoryId,
  },
  {
    id: 'c48912b3-f7cf-4a17-bfd5-97f5331f797f',
    name: 'French Fries',
    slug: 'side-fries',
    imageUrl: '/dish-vibes/side-fries.webp',
    description: 'Fried potatoes with sea salt.',
    price: 4.5,
    featured: true,
    categoryId: sidesCategoryId,
  },
];

/** A row inserted later, to simulate a write that happens after the seed. */
export const createExtraDish = (): Dish => ({
  id: '2d50d04d-9066-4ba3-8ed0-d5857f10d0fa',
  name: 'Pizza Marinara',
  slug: 'pizza-marinara',
  imageUrl: '/dish-vibes/pizza-marinara.webp',
  description: 'Tomato, garlic and oregano.',
  price: 11,
  featured: true,
  categoryId: pizzasCategoryId,
});
