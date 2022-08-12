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
}

interface ISubContent {
  id?: number;
  sloganId?: number;
  name: string;
  title?: string;
  content?: string;
  image?: string;
}
