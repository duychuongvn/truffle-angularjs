import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Web3Service } from './web3.service';

declare var require: any;
const physicalgoldArtifacts = require('../../build/contracts/PhysicalGold.json');
const contract = require('truffle-contract');

@Injectable()
export class PhysicalGoldService {

  PhysicalGold = contract(physicalgoldArtifacts);

  constructor(
    private web3Ser: Web3Service,
  ) {
    this.PhysicalGold.setProvider(web3Ser.web3.currentProvider);
  }


  loadGolds(account): Observable<number> {
    let owners = new Array();
    let meta;
    return Observable.create(observer => {
      this.PhysicalGold
        .deployed()
        .then(instance => {
          console.log("====instance: "+ instance)
          meta = instance;
          return instance.totalSupply.call({from: account});
        })
        .then(totalSupply => {

          for (let i = 0; i < totalSupply; i++) {

            this.getGoldId(account, i).subscribe(value => {
              var owner = {tokenId: "", address: ""};
              owners.push(owner);
              owner.tokenId = value;
              this.getOwner(account, value).subscribe(result => {
                owner.address = result;
              });
            });

            observer.next(owners);
            observer.complete();
          }

        })
        .catch(e => {
          console.log("------"+e);
          observer.error(e)
        });
    })
  }

  getOwner(account, tokenId): Observable<any> {

    return Observable.create(observer => {
      this.PhysicalGold.deployed().then(instance => {
        return instance.ownerOf.call(tokenId, {from: account});
      }).then(owner => {
        observer.next(owner);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  getGoldId(account, index): Observable<any> {

    return Observable.create(observer => {
      this.PhysicalGold.deployed().then(instance => {

        return instance.tokenByIndex.call(index, {from: account});
      }).then(tokenId => {

        observer.next(tokenId);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }


}
