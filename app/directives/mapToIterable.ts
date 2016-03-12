import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'mapToIterable'
})
export class MapToIterable implements PipeTransform {
  transform(dict: Object): any[] {
    var a = [];
    for (var key in dict) {
      if (dict.hasOwnProperty(key)) {
        a.push({ key: key, val: dict[key] });
      }
    }
    return a;
  }
}