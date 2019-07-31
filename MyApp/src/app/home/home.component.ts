import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl,  FormBuilder }  from '@angular/forms';
import * as fs from 'fs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  heroForm: FormGroup;
  private tagserialnumber ="123";
  get diagnostic() { return JSON.stringify(this.heroForm, this.getCircularReplacer());}
  constructor(private translate: TranslateService) { }
  links = ["https://www.maximintegrated.com/en/products/ibutton/software/tmex/download_drivers.cfm","http://www.maxim-ic.com/1-wiredrivers"]
  ngOnInit() {
    this.heroForm = new FormGroup({ 'tagserialnumber': new FormControl(this.tagserialnumber, [])});
  }
  changeLanguage(lang:string){
    this.translate.setDefaultLang(lang);
  }

  saveData(){ 
    console.log(this.heroForm.value.tagserialnumber);
    fs.appendFileSync("C:\\temp\\MySerials.log",this.heroForm.value.tagserialnumber+"\r\n", 'utf8')
  }

  readData(){
    var data = fs.readFileSync("C:\\temp\\mySerials.log", 'utf8');
    console.log(data);

  }


  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  
  
}
