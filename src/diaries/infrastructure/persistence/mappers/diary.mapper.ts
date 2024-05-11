import { Diary } from 'src/diaries/domain/diary';
import { DiaryEntity } from '../entities/diary.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

export class DiaryMapper {
  static toDomain(raw: DiaryEntity): Diary {
    const diary = new Diary();
    diary.id = raw.id;
    diary.user = raw.user;
    diary.content = raw.content;
    diary.imageLinks = raw.imageLinks;
    diary.createdAt = raw.createdAt;
    diary.updatedAt = raw.updatedAt;
    diary.deletedAt = raw.deletedAt;

    return diary;
  }

  static toPersistence(diary: Diary): DiaryEntity {
    const diaryEntity = new DiaryEntity();

    if (diary?.id) {
      diaryEntity.id = diary.id;
    }

    const userEntity = new UserEntity();
    userEntity.id = Number(diary.user?.id);
    diaryEntity.user = userEntity;

    diaryEntity.content = diary.content;
    diaryEntity.imageLinks = diary.imageLinks;
    diaryEntity.createdAt = diary.createdAt;
    diaryEntity.updatedAt = diary.updatedAt;
    diaryEntity.deletedAt = diary.deletedAt;

    return diaryEntity;
  }
}
