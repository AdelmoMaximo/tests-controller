import { PdcaA3Entity } from 'src/pdca/entities/pdcaa3.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('A3_NOTIFY')
export class a3_notifyEntity {
  @PrimaryGeneratedColumn()
  a3_notify_id: number;

  @Column()
  pdcaa3_id: number;

  @Column()
  a3_notify_message: string;

  @Column()
  a3_notify_is_seen: boolean;

  @Column()
  a3_notify_created_at: Date;

  @ManyToOne(() => PdcaA3Entity,(pdca) => pdca.notifications)
  @JoinColumn({name:'pdcaa3_id'})
  pdcaa3:PdcaA3Entity;
}
