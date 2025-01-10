import { AppDataSource } from '../../src/config/ormconfig';
import { Product } from '../../src/models/Product';
import { User } from '../../src/models/User';

export const truncateTables = async () => {
  await AppDataSource.getRepository(Product).clear();
  await AppDataSource.getRepository(User).clear();
};
