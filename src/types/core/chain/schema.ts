export type RSchemaWithDefault = {
  readonly $id: string;
  readonly type: string;
  readonly properties: Record<string, unknown>;
  readonly required: string[];
  readonly default: Record<string, unknown>;
};
