import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { OrderEntryModal } from './modals/order-entry/order-entry';
import { HealthEditModal } from './modals/health-edit/health-edit';

@Component({
  selector: 'page-combat',
  templateUrl: 'combat.html'
})
export class CombatPage {
  static readonly HEALTH_PARAMETER = 'health';

  groups : CombatantGroup[];
  groupIndex : number;
  memberIndex : number;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.groups = [];
    this.groupIndex = 0;
    this.memberIndex = 0;

    this.insertEntry = this.insertEntry.bind(this);
  }

  presentOrderEntryModal() {
    let entryModal = this.modalCtrl.create(OrderEntryModal);
    entryModal.onDidDismiss(this.insertEntry);
    entryModal.present({
      keyboardClose: false
    });
  }

  insertEntry(group : CombatantGroup) {
    // If no saved groups, push immediately
    if (this.groups.length == 0) {
      this.groups.push(group);
      return;
    }

    // Otherwise loop over each group to find sorted initiative
    for (var index = 0; index < this.groups.length; index++) {
      if (this.groups[index].initiative < group.initiative) {
        this.groups.splice(index, 0, group);
        return;
      }
    }
    
    // If no saved groups had a lower initiative, add the new one to the end
    this.groups.push(group);
  }

  nextCombatant() {
    if (this.groups.length === 0) {
      return;
    }

    if (++this.memberIndex >= this.groups[this.groupIndex].members.length) {
      this.memberIndex = 0;
      if (++this.groupIndex >= this.groups.length) {
        this.groupIndex = 0;
      }
    }
  }

  editHealth(health : Health) {
    let data = {};
    data[CombatPage.HEALTH_PARAMETER] = health;

    let healthModal = this.modalCtrl.create(HealthEditModal, data);
    healthModal.present();
  }
}

export interface CombatantGroup {
  name: string;
  initiative: number;
  members: Combatant[];
}

export interface Combatant {
  name: string;
  health: Health;
}

export class Health {
  max: number;
  current: number;

  constructor(max: number) {
    this.max = this.current = Math.floor(max);
  }

  public change(delta : number) {
    this.current += delta;
    this.current = Math.min(Math.max(this.current, 0), this.max);
  }
}
