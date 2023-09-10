export {};

declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */

   interface CafeDataArray {
    data: CafeData[];
   }

   interface CafeData {
    place: string;
    neighborhood: string;
    price: number;
  }

  type Order = 'asc' | 'desc';
}