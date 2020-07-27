import { FormControl } from "@angular/forms";

export class Validator {
  static validDate(fg: FormControl) {
    var valid: Boolean = true;
    var dateSundays: Date = new Date(2020, 6, 20);
    var array = [];
    var invalidDates = [];
    for (let index = 0; index < 23; index++) {
      dateSundays.setDate(dateSundays.getDate() + 7);
      invalidDates.splice(index, 0, dateSundays.toISOString());
    }
    for (let index = 0; index < invalidDates.length; index++) {
      var arr = invalidDates[index].split("T");
      array.splice(index, 0, arr[0]);
      if (fg.value.includes(array[index])) {
        valid = false;
      }
    }
    console.log(valid);
    if (valid) {
      return null;
    } else {
      return { validDate: true };
    }
  }
}
