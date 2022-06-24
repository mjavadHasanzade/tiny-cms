interface ISettings {
  siteName?: string;
  logo?: string;
}

interface IAny {
  name?: string;
}

interface IPosts {
  id: Number;
  title: String;
  description: String;
  cover?: String;
  createdAt: string;
  published: Boolean;
  postComments: IComments[];
}

interface IComments {
  id: number;
  userName: String;
  text?: String;
}
