import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import 'src/app/shared/utilties/extension.ts'

@Pipe({
  name: 'short_number'
})
export class ShortNumberPipe implements PipeTransform {

  constructor() {

  }
  transform(value: any, roundingScale: number = null): any {
    if (isNaN(value)) return null; // will only work value is a value
    if (value === null) return null;
    if (value === 0) return null;

    if (Math.abs(Number(value)) < 1.0e+6) {
      if (roundingScale != null) {
        value = _.round(value, roundingScale)
      }
      let retval= value.thousandsSeparator();
      return retval;
    }
    let abs = Math.abs(value);
    const rounder = Math.pow(10, 1);
    const isNegative = value < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
      { key: 'Y', value: Math.pow(10, 24) }, //Septillion
      { key: 'Z', value: Math.pow(10, 21) }, //Sextillion
      { key: 'E', value: Math.pow(10, 18) }, //Quintillion
      { key: 'P', value: Math.pow(10, 15) }, //Quadrillion
      { key: 'T', value: Math.pow(10, 12) }, //Trillionsq
      { key: 'B', value: Math.pow(10, 9) },//Billions
      { key: 'M', value: Math.pow(10, 6) } //Millions
      // {key: 'K', value: 1000}  //thousands
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  }

}