import { Billing, CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing, CONNECTION_BOOMONEY)
    private readonly billingRepository: Repository<Billing>,
  ) {}

  /**
   * 创建账本
   */
  create(createBillingInput: CreateBillingInput) {
    return this.billingRepository.save(
      this.billingRepository.create(createBillingInput),
    );
  }

  /**
   * 查询多个账本
   */
  getBillings() {
    return this.billingRepository.find();
  }

  /**
   * 查询单个账本
   */
  getBilling(id: number) {
    return this.billingRepository.findOneBy({
      id,
    });
  }

  /**
   * 更新账本信息
   */
  update(id: number, updateBillingInput: UpdateBillingInput) {
    return this.billingRepository.update(id, updateBillingInput);
  }

  /**
   * 删除账本信息
   */
  remove(id: number) {
    return this.billingRepository.delete(id);
  }
}
