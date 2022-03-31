import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AlbumService } from './album.service';
import { Album } from '../../../../libs/data-base/src/entities/boomart/album.entity';
import { CreateAlbumInput } from './dto/create-album.input';
import { UpdateAlbumInput } from './dto/update-album.input';

@Resolver(() => Album)
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Mutation(() => Album)
  createAlbum(@Args('createAlbumInput') createAlbumInput: CreateAlbumInput) {
    return this.albumService.create(createAlbumInput);
  }

  @Query(() => [Album], { name: 'album' })
  findAll() {
    return this.albumService.findAll();
  }

  @Query(() => Album, { name: 'album' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.albumService.findOne(id);
  }

  @Mutation(() => Album)
  updateAlbum(@Args('updateAlbumInput') updateAlbumInput: UpdateAlbumInput) {
    return this.albumService.update(updateAlbumInput.id, updateAlbumInput);
  }

  @Mutation(() => Album)
  removeAlbum(@Args('id', { type: () => Int }) id: number) {
    return this.albumService.remove(id);
  }
}
