import { Transform } from 'class-transformer';
import { User } from 'src/users/domain/user';

export class Diary {
  id?: string;

  @Transform(
    ({ value }) => ({
      id: value.id,
    }),
    { toPlainOnly: true },
  )
  user: User;

  content: string;

  //   @Transform(({ value }) => value.split(','), { toPlainOnly: true })
  imageLinks: Array<string>;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
