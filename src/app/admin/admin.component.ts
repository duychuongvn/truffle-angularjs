import { Component, HostListener, NgZone } from '@angular/core';
import {Web3Service, PhysicalGoldService} from '../../service/service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  account: any;
  accounts: any;
  owners: any;
  constructor(private _ngZone: NgZone,
              private  web3Service: Web3Service,
              private  physicalGoldService: PhysicalGoldService) {


   this.onReady();
  }

  onReady = () => {
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() =>

       this.loadGolds()
      );
    }, err => alert(err));
  }


  loadGolds = () => {

    this.physicalGoldService.loadGolds(this.account)
      .subscribe(owners => {
        this.owners = owners;
        console.log(owners);
      }, e => {console.log(e); });
  }

}
