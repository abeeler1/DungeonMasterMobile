import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CharacterListPage } from '../character-list/character-list';
import { Character } from '../../classes/character';
import { CharacterDetailPage } from '../character-detail/character-detail';
import { CombatPage } from '../combat/combat';

@Component({
  selector: 'page-party',
  templateUrl: 'party.html'
})
export class PartyPage {
  static readonly STORED_MEMBERS = 'members';

  members: Character[];

  constructor(public navCtrl: NavController, public storage: Storage) {
    this.members = [];
    storage.get(PartyPage.STORED_MEMBERS).then((characters: Character[]) => {
      if (characters) {
        for(let character of characters) {
          this.members.push(new Character(character));
        }
      }
    });
  }

  presentCharacterList() {
    let data = {};
    data[CharacterListPage.CALLBACK_PARAM] = (character: Character) => {
      this.members.push(character);
      this.saveParty();
    };

    this.navCtrl.push(CharacterListPage, data);
  }

  clickCharacter($event, character) {
    let data = {};
    data[CharacterListPage.CHARACTER_PARAM] = character;
    this.navCtrl.push(CharacterDetailPage, data);
  }

  removeMember(index) {
    this.members.splice(index, 1);
    this.saveParty();
  }

  saveParty() {
    this.storage.set(PartyPage.STORED_MEMBERS, this.members);
  }

  startCombat() {
    let data = {};
    data[CombatPage.CHARACTERS_PARAM] = this.members;
    this.navCtrl.push(CombatPage, data);
  }
}
