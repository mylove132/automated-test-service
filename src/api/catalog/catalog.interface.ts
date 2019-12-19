import { UserData } from '../user/user.interface';
interface CatalogVO {
  catalogId: number;
  catalogName: string;
  createDate: Date,
  updateDate: Date,
}

interface UserVO {
  username: string;
  email: string;
  userid: number;
}

export interface CatalogRO {
  catalog: CatalogVO[]
}


