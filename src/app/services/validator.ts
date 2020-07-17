import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

export class Validator {
  static validDate(fg: FormControl) {
    var valid: Boolean = true;
    var dateSundays: Date = new Date(2020, 6, 20);
    var array = [];
    var invalidDates = [];
    for (let index = 0; index < 23; index++) {
      dateSundays.setDate(dateSundays.getDate() + 7);
      console.log(dateSundays.toISOString());
      invalidDates.splice(index, 0, dateSundays.toISOString());
      console.log(invalidDates);
    }
    for (let index = 0; index < invalidDates.length; index++) {
      var arr = invalidDates[index].split("T");
      array.splice(index, 0, arr[0]);
      console.log(invalidDates);
      console.log(arr);
      console.log(array);
      console.log(fg.value);
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
