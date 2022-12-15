import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
//import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})



export class HomeComponent implements OnDestroy {
    
  qrCodeString = 'This is a secret qr code message';
  scannedResult: any;
  content_visibility = '';


  constructor(public menucontroler: MenuController,
             ) { }

 

  

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

   async checkPermission() {
      try {
        //check or request permission
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          // the user granted permission
          return true;
        }
        return false;
      } catch(e) {
        console.log(e);
      }
    }

    async startScan() {
      try {
        const permission = await this.checkPermission();
        if(!permission) {
          return;
        }
        await BarcodeScanner.hideBackground();
        document.querySelector('body').classList.add('scanner-active');
        this.content_visibility = 'hidden';
        const result = await BarcodeScanner.startScan();
        console.log(result);
        BarcodeScanner.showBackground();
        document.querySelector('body').classList.remove('scanner-active');
        this.content_visibility = '';
        if(result?.hasContent) {
          this.scannedResult = result.content;
          console.log(this.scannedResult);
          
        }
      } catch(e) {
        console.log(e);
        this.stopScan();
      }
    }

    stopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
    }
  

    ngOnDestroy(): void {
      this.stopScan();
    }
}


