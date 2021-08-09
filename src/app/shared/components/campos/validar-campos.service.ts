import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidarCamposService {

  constructor() { }

  hasErrorValidar(control:AbstractControl, errorName: string): boolean {
    if((control.dirty || control.touched) && control.hasError(errorName)){
      return true;
    } else {
      return false;
    }

  }

  lengthValidar(control:AbstractControl, errorName:string):number{
    const error= control.errors![errorName];
    return error.requiredLength || error.min|| error.max ||  0;

  }
}
