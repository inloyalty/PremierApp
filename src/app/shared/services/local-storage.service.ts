import { Injectable } from "@angular/core";
import { EncryptorService } from "./encryptor.service";

@Injectable()
export class LocalStorageService {

    private PREFIX_KEY: string = 'MYD_ADV_APP';

    constructor(private encryptorSvc: EncryptorService) { }
    // get the value from local storage based on key 
    get(key: string, encrypted: boolean = false) {
        let decryptedValue = localStorage.getItem(`${this.PREFIX_KEY}_${key}`)
        if (decryptedValue && decryptedValue.length > 0) {
            if (encrypted){
                decryptedValue = this.encryptorSvc.decrypt(decryptedValue);
            }
            return decryptedValue;
        }
        else {
            return null;
        }
    }

    // set the value in local storage based on key 
    set(key: string, value: string, encrypted: boolean = false) {
        if(encrypted){
            value = this.encryptorSvc.encrypt(value)
        }
        localStorage.setItem(`${this.PREFIX_KEY}_${key}`, value);
    }

    // remove the value from local storage
    remove(key: string) {
        localStorage.removeItem(`${this.PREFIX_KEY}_${key}`);
    }

    // delete all items from local storage 
    clear() {
        localStorage.clear();
    }

    // get all the local storage items
    getAll() {
        let _retVal: any;
        let keys = Object.keys(localStorage);
        if (keys && keys != null && keys.length > 0) {
            let totalRecord = keys.length;
            _retVal = new Array()
            for (let index = 0; index < totalRecord; index++) {
                let keyName = localStorage.key(index);
                let item = {
                    key: keyName,
                    value: localStorage.getItem(keyName)
                }
                _retVal.push(item)
            }
        }
        return _retVal;
    }
}