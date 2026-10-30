import type { Dish } from "../interfaces/dish.interface";
import { pizzas } from "./pizzas";
import { hamburgers } from "./hamburgers";
import { chicken } from "./chicken";
import { pastas } from "./pastas";
import { desserts } from "./desserts";
import { salads } from "./salads";
import { sides } from "./sides";
import { drinks } from "./drinks";

export const dishes: Dish[] = [
  ...pizzas,
  ...hamburgers,
  ...chicken,
  ...pastas,
  ...desserts,
  ...salads,
  ...sides,
  ...drinks,
];
