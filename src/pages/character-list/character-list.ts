import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { CharacterDetailPage } from '../character-detail/character-detail';
import { CharacterEntryModal } from '../character-entry/character-entry';
import { Health } from '../../classes/combat';
import { Character } from '../../classes/character';

@Component({
  selector: 'page-character-list',
  templateUrl: 'character-list.html'
})
export class CharacterListPage {
  static readonly STORED_CHARACTERS = 'characters';
  static readonly CHARACTER_PARAM = 'character';
  static readonly CALLBACK_PARAM = 'callback';

  callback: (Character) => void;
  filter: string;
  loaded: boolean;
  characters: Character[];

  constructor(
      public storage: Storage,
      public params: NavParams,
      public navCtrl: NavController,
      public modalCtrl: ModalController) {
    this.callback = params.get(CharacterListPage.CALLBACK_PARAM);
    this.filter = 'all';
    this.loaded = false;
    this.characters = [];
    storage.get(CharacterListPage.STORED_CHARACTERS).then((characters: Character[]) => {
      if (characters) {
        for(let character of characters) {
          this.characters.push(new Character(character));
        }
      } else {
        this.characters.push(new Character({
          name: "Johnson Jacobs",
          statistics: [6, 10, 14, 15, 9, 8],
          savingThrows: [2, 5],
          health: new Health(15),
          currentHitDie: 1,
          maxHitDie: 1,
          armorClass: 11,
          proficiencies: [2, 4, 8],
          isPlayerCharacter: true
        }));
      }
    });
  }

  get filteredCharacters() {
    return this.filter == 'all' ?
        this.characters :
        this.characters.filter((character: Character) => character.isPlayerCharacter);
  }

  presentCharacterEntryModal() {
    let entryModal = this.modalCtrl.create(CharacterEntryModal);
    entryModal.onDidDismiss((data: Character) => {
      if (data) {
        this.characters.push(data);
        this.storage.set(CharacterListPage.STORED_CHARACTERS, this.characters);
      }
    });

    entryModal.present({
      keyboardClose: false
    });
  }

  clickCharacter(event, character: Character) {
    if (this.callback) {
      this.callback(character);
      this.navCtrl.pop();
    } else {
      let data = {};
      data[CharacterListPage.CHARACTER_PARAM] = character;
      this.navCtrl.push(CharacterDetailPage, data);
    }
  }

  ionViewWillEnter() {
    if (!this.loaded) {
      this.loaded = true;
    } else {
      this.storage.set(CharacterListPage.STORED_CHARACTERS, this.characters);
    }
  }
}
