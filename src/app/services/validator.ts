import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

export class Validator {
  static validDate(fg: FormControl) {
    if (fg.value.includes("Sunday*")) {
      return null;
    } else {
      return { validDate: true };
    }
  }
}
