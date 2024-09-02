export interface FindAllArgs {
  skip?: number;
  take?: number;
  cursor?: any;
  where?: any;
  select?: any;
  orderBy?: any;
  include?: any;
}

export interface FindFirstArgs extends FindAllArgs {
  where?: any;
}

export interface CreateArgs {
  select?: any;
  include?: any;
  data: any;
}

export interface UpdateArgs {
  data: any;
  where: any;
  select?: any;
  include?: any;
}

export interface DeleteArgs {
  where: { id: string };
}

export interface WhereUniqueInput {
  id: string;
}

export class UpdateArgsBuilder {
  private params: UpdateArgs;

  constructor(modelConstructor: new (...args: any[]) => any, where: any) {
    this.params = { data: new modelConstructor(), where: where };
  }

  static create(
    modelConstructor: new (...args: any[]) => any,
    where: any,
  ): UpdateArgsBuilder {
    return new UpdateArgsBuilder(modelConstructor, where);
  }

  setSelect(select: any): this {
    this.params.select = select;
    return this;
  }

  setInclude(include: any): this {
    this.params.include = include;
    return this;
  }

  setData(data: any): this {
    this.params.data = data;
    return this;
  }

  build(): UpdateArgs {
    return this.params;
  }
}

export class CreateArgsBuilder<TCreate extends CreateArgs> {
  private params: TCreate;

  constructor(modelConstructor: new (...args: any[]) => TCreate) {
    this.params = new modelConstructor();
  }

  static create<TCreate extends CreateArgs>(
    modelConstructor: new (...args: any[]) => any,
  ): CreateArgsBuilder<TCreate> {
    return new CreateArgsBuilder<TCreate>(modelConstructor);
  }

  setSelect(select: any): this {
    this.params.select = select;
    return this;
  }

  setInclude(include: any): this {
    this.params.include = include;
    return this;
  }

  setData(data: any): this {
    this.params.data = data;
    return this;
  }

  build(): TCreate {
    return this.params;
  }
}

export class FindAllArgsBuilder {
  protected params: FindAllArgs = {};

  static create(): FindAllArgsBuilder {
    return new FindAllArgsBuilder();
  }

  skip(skip: number): this {
    this.params.skip = skip ? skip : undefined;
    return this;
  }

  take(take: number): this {
    this.params.take = take ? take : undefined;
    return this;
  }

  cursor(cursor: any): this {
    this.params.cursor = cursor;
    return this;
  }

  where(where: any): this {
    this.params.where = where;
    return this;
  }

  orderBy(orderBy: any): this {
    this.params.orderBy = orderBy;
    return this;
  }

  include(include: any): this {
    this.params.include = include;
    return this;
  }

  select(select: any): this {
    this.params.select = select;
    return this;
  }

  build(): FindAllArgs {
    return this.params;
  }
}
export class FindFirstArgsBuilder {
  private args: FindFirstArgs;

  private constructor(where: any) {
    this.args = {
      where,
    };
  }

  public skip(skip: number): this {
    this.args.skip = skip;
    return this;
  }

  public take(take: number): this {
    this.args.take = take;
    return this;
  }

  public cursor(cursor: any): this {
    this.args.cursor = cursor;
    return this;
  }

  public orderBy(orderBy: any): this {
    this.args.orderBy = orderBy;
    return this;
  }

  public include(include: any): this {
    this.args.include = include;
    return this;
  }

  public build(): FindFirstArgs {
    return this.args;
  }

  public static create(where: any): FindFirstArgsBuilder {
    return new FindFirstArgsBuilder(where);
  }
}
