import type { Inquiry } from "@/shared/interfaces/inquiry.interface";
import { ChefHat, Clock, FileText, CalendarClock, ShoppingBag, Undo2 } from "lucide-react";

export const questions: Inquiry[] = [
  {
    id: 'dad36141-8d5f-46d4-99bb-66e038112a13',
    query: 'How long does my order take ?',
    answer: 'Each kitchen shows its estimated preparation time, and your order page updates as the kitchen works on it.',
    icon: Clock,
  },
  {
    id: '6da56c17-1931-45e0-8670-331c78193021',
    query: 'Can I order online and pick up on site ?',
    answer: 'Yes, of course, you can order online and pick up your order on site. Just select the "Pick Up" option during checkout.',
    icon: ShoppingBag,
  },
  {
    id: '835fcae9-89ff-4038-87c8-6c381838f89a',
    query: 'Can I add special instructions to my order ?',
    answer: 'Yes, you can add special instructions to your order during checkout. Please note that we cannot guarantee that all instructions will be followed, as some may not be feasible.',
    icon: FileText,
  },
  {
    id: '79fb5169-896b-454d-8a07-3a3aefe72368',
    query: 'Can I cancel my order ?',
    answer: 'Yes, you can cancel your order before it is prepared. Please contact our customer support team for assistance.',
    icon: Undo2,
  },
  {
    id: '36abb7da-8eeb-4603-abc9-793ee2c26d86',
    query: 'Can I schedule an order for a specific date ?',
    answer: 'Yes of course, just give us the calendar day and hour and your order will be in you provided location.',
    icon: CalendarClock,
  },
  {
    id: 'd9653a21-f1cf-41ee-9537-680492ef8810',
    query: 'Is there any refund policy ?',
    answer: 'Yes, we have a refund policy in place. If you are not satisfied with your order, please contact our customer support team within 24 hours of receiving your order to request a refund.',
    icon: ChefHat,
  },
];