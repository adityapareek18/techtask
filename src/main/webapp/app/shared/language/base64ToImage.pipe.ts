import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64',
})
export class Base64Pipe implements PipeTransform {
  constructor() {}

  public transform(value: any): any {
    return `data:image/jpeg;base64,${value}`;
  }
}
