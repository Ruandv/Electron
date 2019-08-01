import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as fs from 'fs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  heroForm: FormGroup;
  private tagserialnumber = '';
  language = 'en';
  links = ['https://www.maximintegrated.com/en/products/ibutton/software/tmex/download_drivers.cfm', 'http://www.maxim-ic.com/1-wiredrivers'];
  get diagnostic() {
    return JSON.stringify(this.heroForm, this.getCircularReplacer());
  }
  constructor(private translate: TranslateService) {
    this.readData();
  }

  ngOnInit() {
    this.heroForm = new FormGroup({ tagserialnumber: new FormControl(this.tagserialnumber, [Validators.required]) });
    this.translate.setDefaultLang(this.language);
  }
  changeLanguage(lang: string) {
    this.language = lang;
    this.translate.setDefaultLang(this.language);
  }

  saveData() {
    console.log(this.heroForm.value.tagserialnumber);
    fs.appendFileSync('C:\\temp\\MySerials.log', new Date().toDateString() + ',' + this.heroForm.value.tagserialnumber + '\r\n', 'utf8');
    this.readData();
  }

  readData() {
    const data = fs.readFileSync('C:\\temp\\mySerials.log', 'utf8');
    console.log(data);
    this.links = data.split('\r\n');
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}
