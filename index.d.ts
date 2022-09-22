interface ISettings {
  siteName?: string;
  logo?: string;
}

interface IAny {
  name?: string;
}

interface IPosts {
  id: number;
  title: string;
  description: string;
  cover?: string;
  createdAt: string;
  published: boolean;
  postComments: IComments[];
}

interface IComments {
  id: number;
  userName: string;
  text?: string;
}

interface ISlogan {
  id?: number;
  name: string;
  title: string;
  content?: string;
  image?: string;
  subContent?: ISubContent[];
  link?: string;
}

interface ISubContent {
  id?: number;
  sloganId?: number;
  name: string;
  title?: string;
  content?: string;
  image?: string;
  link?: string;
}

interface IUser {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
  password?: string;
}
