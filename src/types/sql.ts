export type Command = {
  text: string;
  time: Date;
  id: string;
  output?: any[];
  error?: string;
};

export type TableSchema = {
  name: string;
  columns: TableColumn[];
  rowCount: number;
};

export type TableColumn = {
  cid: number; // column id (index)
  name: string; // column tyoe
  type: string; // column data type (capitalized)
  notnull: number; // boolean
  dflt_value: any;
  pk: number; // boolean
};
