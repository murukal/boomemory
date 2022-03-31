import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CollectionService } from './collection.service';
import { Collection } from './entities/collection.entity';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';

@Resolver(() => Collection)
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}

  @Mutation(() => Collection)
  createCollection(@Args('createCollectionInput') createCollectionInput: CreateCollectionInput) {
    return this.collectionService.create(createCollectionInput);
  }

  @Query(() => [Collection], { name: 'collection' })
  findAll() {
    return this.collectionService.findAll();
  }

  @Query(() => Collection, { name: 'collection' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.collectionService.findOne(id);
  }

  @Mutation(() => Collection)
  updateCollection(@Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput) {
    return this.collectionService.update(updateCollectionInput.id, updateCollectionInput);
  }

  @Mutation(() => Collection)
  removeCollection(@Args('id', { type: () => Int }) id: number) {
    return this.collectionService.remove(id);
  }
}
