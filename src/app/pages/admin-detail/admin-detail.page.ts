import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder } from "@angular/forms";
import { RegisterCarPage } from "../register-car/register-car.page";
import * as pdfmake from "../../../www/pdfmake/build/pdfmake.js";
import * as pdfFonts from "../../../www/pdfmake/build/vfs_fonts";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-admin-detail",
  templateUrl: "./admin-detail.page.html",
  styleUrls: ["./admin-detail.page.scss"],
})
export class AdminDetailPage implements OnInit {
  services: Observable<any>;
  serviceDate;
  docId;
  myDate = new Date().toISOString(); /* variable gets the current date and save as an ISOString object */
  vehiclePiecesId = [];
  vehiclePiecesName = [];
  vehiclePiecesValue = [];
  vehiclePieces = [
    {
      id: 1,
      name: "Unexposed bumper",
      value: 25,
    },
    { id: 3, value: 25, name: "Exposed Bumper" },
    { id: 4, value: 20, name: "Cowl screen" },
    { id: 5, value: 20, name: "Decklid" },
    { id: 6, value: 30, name: "Fascia rear and support" },
    { id: 7, value: 20, name: "Fender" },
    { id: 8, value: 25, name: "Front clip" },
    { id: 9, value: 25, name: "Front fascia and header panel" },
    { id: 10, value: 25, name: "Grille" },
    { id: 11, value: 20, name: "Pillar and hard trim" },
    { id: 12, value: 30, name: "Quarter panel" },
    { id: 13, value: 40, name: "Radiator core support" },
    { id: 14, value: 30, name: "Rocker" },
    { id: 15, value: 20, name: "Roof rack" },
    { id: 16, value: 20, name: "Spoiler" },
    { id: 17, value: 20, name: "Front spoiler" },
    { id: 18, value: 20, name: "Rear spoiler" },
    { id: 19, value: 10, name: "Rims" },
    { id: 20, value: 10, name: "Hubcap" },
    { id: 21, value: 40, name: "Tire/Tyre" },
    { id: 22, value: 25, name: "Trim package" },
    { id: 23, value: 15, name: "Trunk/boot/hatch" },
    { id: 24, value: 15, name: "Trunk/boot latch" },
    { id: 25, value: 20, name: "Valance" },
    { id: 26, value: 20, name: "Welded assembly" },
    { id: 27, value: 10, name: "Ammeter" },
    { id: 28, value: 10, name: "Clinometer" },
    { id: 29, value: 10, name: "Dynamometer" },
    { id: 30, value: 10, name: "Fuel gauge" },
    { id: 31, value: 20, name: "Manometer" },
    { id: 32, value: 20, name: "Hydrometer" },
    { id: 33, value: 30, name: "Odometer" },
    { id: 34, value: 30, name: "Speedometer" },
    { id: 35, value: 30, name: "Tachometer" },
    { id: 36, value: 20, name: "Temperature gauge" },
    { id: 37, value: 10, name: "Tire pressure gauge" },
    { id: 38, value: 10, name: "Vacuum gauge" },
    { id: 39, value: 40, name: "Voltmeter" },
    { id: 40, value: 20, name: "Water temperature meter" },
    { id: 41, value: 30, name: "Oil pressure gauge" },
    { id: 42, value: 0, name: "None" },
  ];

  static invalidDates = [];
  dateSundays: Date = new Date(
    2020,
    6,
    20
  ); /* Variable to hold an initial Sunday date (19/07/2020) */

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public navCtrl: NavController
  ) {
    for (let index = 0; index < 23; index++) {
      this.dateSundays.setDate(this.dateSundays.getDate() + 7);
      RegisterCarPage.invalidDates.splice(
        index,
        0,
        this.dateSundays.toISOString()
      );
    }
  }

  dateChanged(date) {
    var array = [];

    for (let index = 0; index < RegisterCarPage.invalidDates.length; index++) {
      var arr = RegisterCarPage.invalidDates[index].split("T");
      array.splice(index, 0, arr[0]);
      if (date.detail.value.includes(array[index])) {
        window.alert("Closed on sundays. Please pick another date.");
        date.detail.value = this.myDate;
      }
    }
  }

  getDate() {
    return this.route.snapshot.paramMap.get("date");
  }
  getStatus() {
    return this.route.snapshot.paramMap.get("status");
  }
  getDocUid() {
    return this.route.snapshot.paramMap.get("docId");
  }
  getUserUid() {
    return this.route.snapshot.paramMap.get("uid");
  }
  getId() {
    return this.route.snapshot.paramMap.get("id");
  }
  getService() {
    return this.authService.getServiceType(this.getId());
  }
  async getPieceId() {
    return await this.authService.getPiecesId(this.getId());
  }
  getClientFName() {
    return this.authService.getClientFName(this.getUserUid());
  }
  getClientLName() {
    return this.authService.getClientLName(this.getUserUid());
  }
  getClientMobile() {
    return this.authService.getClientMobile(this.getUserUid());
  }
  getClientVehicle() {
    return this.authService.getClientVehicle(this.getId());
  }
  getClientVehiclePlate() {
    return this.authService.getClientVehiclePlate(this.getId());
  }
  checkStatus(): Boolean {
    var valid = false;
    if (this.getStatus() === "Fixed") {
      valid = true;
    } else {
      valid = false;
    }
    return valid;
  }
  async getPieceName() {
    var piecesName = [];
    var ids = this.getPieceId();
    var vehicleIds = [];
    var lenght = (await ids).length;
    for (let index = 0; index < lenght; index++) {
      vehicleIds.splice(index, 0, (await ids)[index]);
    }
    for (let index = 0; index < vehicleIds.length; index++) {
      piecesName.splice(
        index,
        0,
        await this.authService.getPieceName(vehicleIds[index])
      );
    }
    return piecesName;
  }

  async getPieceValue() {
    var piecesValue = [];
    var ids = this.getPieceId();
    var vehicleIds = [];
    var lenght = (await ids).length;
    for (let index = 0; index < lenght; index++) {
      vehicleIds.splice(index, 0, (await ids)[index]);
    }
    for (let index = 0; index < vehicleIds.length; index++) {
      piecesValue.splice(
        index,
        0,
        await this.authService.getPieceValue(vehicleIds[index])
      );
    }
    return piecesValue;
  }

  async getCost() {
    const service = await this.getService();
    const piecesValue = await this.getPieceValue();

    var cost;
    var piecesCost = 0;
    var finalCost;
    console.log("service: " + service);
    if (service === "Repair") {
      cost = 50;
    } else if (service === "Major Repair") {
      cost = 100;
    } else if (service === "Annual Service") {
      cost = 200;
    } else if (service === "Major Service") {
      cost = 250;
    } else {
      cost = 0;
    }
    console.log("Service cost from getcost: " + cost);

    var length = (await piecesValue).length;
    for (let index = 0; index < length; index++) {
      piecesCost = piecesCost + piecesValue[index];
    }
    console.log("pieces cost from getcost: " + piecesCost);
    finalCost = (await cost) + piecesCost;
    return finalCost;
  }

  async generatePDF() {
    var cost;
    const date = new Date().toISOString();
    const service = await this.getService();
    const piecesName = await this.getPieceName();
    const piecesValue = await this.getPieceValue();
    const clientFName = await this.getClientFName();
    const clientLName = await this.getClientLName();
    const clientMobile = await this.getClientMobile();
    const clientVehicle = await this.getClientVehicle();
    const clientVehiclePlate = await this.getClientVehiclePlate();

    const finalCost = await this.getCost();

    if (service === "Repair") {
      cost = 50;
    } else if (service === "Major Repair") {
      cost = 100;
    } else if (service === "Annual Service") {
      cost = 200;
    } else if (service === "Major Service") {
      cost = 250;
    } else {
      cost = 0;
    }

    var splitDate = date.split("T");

    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    var docDefinition = {
      content: [
        {
          columns: [
            [
              {
                image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAB0uSURBVHhe7Z0JtB1VlYYJiu2EAziDjQqKImBLyAAvIYqCaRwQNIpzo4AtErNkCuQlvMaWGAalRUSJSFBpVBREEaWJCsggDqACIsgQQMYwySgEAv39z3Ov9ertGm/de+vW2/9a37pD7XPqnKq9azzDGi6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XKN0zrwXjgGfg6XwW1w+wCwAi6C02AYpsOa4HJ1rE3gePg7PNEgroa94GnQV42MjGx90EEHnZzBgcHcVRM9G46CR8FysKZwLfw79E2LFi1aSgA8kQY2DxBIzwxJXH3WZJDjWA7VVL4ET4Ge6uSTT34Szr/SCoo4Cxcu/HBI5uqjdoamXU7l5QLQvVbPNDw8vK0VDAmcGZK5+qRdIc8l1VXwUzh5QDgFLoR7wapPlD/CC6An4uxxtBEIJtg+ymXWi0JSV4+1C6wGy2nEQ3AkbASDKl1CvR1+A1YdWyhIngNdFc6+Jk5/qxUMKcwLyV091BthFVjOIn4JG0JTNAn2gPvBqq84G/4FuiYur2YYAZCFgtvVQ20AK8FyEqH3Hk+GJmpTuAGseosvQ9fE2eN/jADIhJv1jUMWri7rSaAbU8s5xGHQdK0HaU/s3gRjxKXRs+Bfw8+ymkSA3GAFQBYEyMEhj1LizLUh+ewefrpSNB8spxBdPXrWTDqL3gzxbXAS6CDSloID57oQ514Fy/j96rCokBYsWDA96vQFuYYsdJlYSPPnz38ZZV6qsisfPifCAbC0NoOHIe4UQk+oxjjGBNCW8CC0tsE3wQyOiKPKyVbDKSxT+tySc0bzKQrrU3OZXMJ2fdb3VRgNjCgqRzBzRbQWXALRoGhxPfT0XUCN9BHQNvg6jGmrZQVHHJxtud5rhCSWJpHPtth9D/txzloE8riHzyPT7kdCYBwND8fTR2G5B0lMn4R4YAg95p0BE1kfgsLBEQWH+zXsRLrRfPh8Dv/P478/x207hTwfh+UEys56K6/1cfn2YpYdCQ9FbdMgDw+SID3fvwOsAFFzC1dERYMjCk73J/gGPGgt7wI3sa4T+cwdGFE8SP6hI8AKDl1aPQNcQYcffvgzcJxSwTHATOgXkS+DpBeCfW3RWkcde+yxa3FUXWE4UWOhvnppPGG1FKzgUAcolyGcZve4EzUYtVebsHopWGePx0HN212GJtJZhHruGKo9IZV076GXYa4U4TyNP4sQHFdQ1cIvH+umd4D6Vt8C8X7XN8Jv4UTQo0r1CGxJPdH+BvHg0NlDLwxdKerRWeQx1nEtLOf7aDdbvut9yfl83hJsusbChQs/GKo7sNILobQWt3HuAjUl0bPxPcN/cX4IrhzCiT4Sd6pOwfFvhiOGh4e3HxkZeXpYlakDDzzw+Tjxe7D/Ftxv5VcW8luhg0BY1cBqEVhOnsVy0OnTWjYErhyaM2eOusZW8qKPfH6Ns79TeYbsC2mfffbR4+d5cGM03w6YG7IeaH0LLCcvi/crKCic+v2Gc+WGwLityksZnXXIczE8Yq0vD6Rd+elPf7rvI7tUIXUdtRy9LP8BrgLq5CxCYJypy6SQVaVasGDBVMp1nbXeLEi3IGQz8NLYVJajl0E35y8GV0HhVB+IO1kWOOFRrXZZ3RL5r8N6fmWtPwnsH1S6kMXAK6mBYVl0E6+2Ny8HV07hWEUf+R4SkmYK2/fhtHvyOQfH1YB9haR7E9KfF1l3KtiuZj2vCMkHXor0W8Fy9k5QC95zQH201wVXinCqiy1ns8BWzeZzv1vAWd9JmscjedzC78PUOjeYZOqAAw54LumuiOSRxaEhaSOkPtR/AMvRq+AxOB90XToVmtoXvZRw4Ny9ABVIc+fOLTzoA+nGDQPEf/eDhknNFWw6+5DugXg+CawsU846S9eyalC2BH4G6k/9CFgO3ykPgNahdenpy+ugURuziHDSbxgONg7sHuGmvNTACnqiRPo/JuR7Yt73FcPDw3OtPCyqfLJWR+myqJfDhOpl5Z/gu6B7GD1D11hTW0AdbvieCrqv0jue98G+cCz8AtTaYAoUFpcu6+Kgf7ccLA52OqCUls4A5GH2IeF/PazJPJOEJ25/sPIw0FVDI6VLILXEtRy5XyiANC3C5XAeaLhMPaI+Do4GDYg9UhK1J1Me4ttwKmj8qotBw/ekjXPVolSAcJTdz3CsceCU9+LgHR8oyOvj8bxbUJbdglmqKMuOVnoL8nx9SNYo6ehoOYGTTO4A2W+//dbGcT6Mo6l91GNxp7LAVkE8TuTzyvA1t8hLbbGsddwzf/78aFu7JGlooT9ZecTBTn3kfwy7VhHgdZDGj80z1qwzltQAwTmejLO8FU6Cwl1lSb95yKotLs9exbLbWPaS8FcukeZD0bxjqJ1dpqjDAUbaLFYR0GeRdo9uvdzshTROruUATjpmgOAMU3CKL/F5u+EwuSCtBvUeJ5aNBJufFWl/hX1id1/WdWkwSxVBqeA088iJWhmfzecniwZ4P6Ub0XvAcgAnnXaALF68eF12PPt/0VURhygN+ejeaJwIvF+0bPiuKeAyRV6To3lbcHR/YTBPFbY3xdOWgTJpDDCNxFl7aThMa+c72bQDBGfdwXKEDtC4WuPE/20HxcEeha3CokRhs6yVJglsZgXzVGH3Ayt9WUK2tVbZpu9OFwOESxBztEMcdMwgcfy+HtvE6RX0SBm7zKF7yCdXF1nslljpyxKyrbXUazC+4518dC1AhoeH1e9/nHBQjYI4xpb/vhcWt6WgoUybsewLcXsL7HKNREOe6jti5lGGkG2tpbFz4zs+ib+Azjh6cfY8aEk92DQZzhzQu4m0aQCaRDfPIOZZAUdOaiJ/JpzD8quh8BMz7kHU9ChT2O4aT9sJIdtaSy/H4js+jhoh7gd5n5ro7ex2cAZY+TWFfgTI8ZZ9h9zXGmo0S9RzNyN9aUK2tVaeAFHz+LLStfTvwcp30OlagMyfP9+cM4QAyf1GOy/kuZpPzSmZKWz3jafvhJBtrZUVIGq+3ukQLmrGorZWVv5RNGTpaaDmJHVD7a/iM/Z28wyydch6jPhfLx//aqXphLxBQj0PjafthJBtrZUVIBoeqCqpn4h6IFrrkRPWvUn8ayHaRqtrAUJ+id2YWV64J2Ie8gQJy8+KpumUkG2tlRYguvdYG6pU0qBzB4Fu8utOdFbbaIC8DgfL1VYpD+SloV2TNAmbU+NpqiAtSDh7aSbdcU/RSqA36mqTZr7rqZvSAkSdnqru/6yAa0q7r3aAtESgbMzOX8jOvyTiEIUhj6tDlqZw1qdj15XR4pOCZLjcTLptyPf3sHeRXo11UNYl1jSoWmeBta5B4y2QKBxqQxxif4LmN5bDZEG61Gbjod/4d6y0nWIFCeX5YtwuC/LR5KKHENCF+8XXRVkBchmsD1VJTavV2Si+HvXH0KiNdSc67Krup7T9dKmQOh9KmPRyb5xMk3ZG+4qnkWsSIuzmkGclbcCiRIMk9E68I25jgd3dsJQDxDa6LBst5AArK0CEuuGeDrp/sDof5UUvEXXpYK1jEBquaexhq+xCN+/LQG2aUp/64Tx7W45lcB8Olqs/Rej1tx1pjuRTLWYvhxt19uL38XBCyLMQpBsNEj4/FV+WBOtUd+rGKE+A9Ir9wTpq1wX1aLTKHec60AFBkwyNk5weR8o1tRmOaXaaKiPyKjUbroIE7rKWxcFuIFroFlGdAqRpJF6C4Uh5j+jqcFTZqPllgyQvlLVxgzZ4gPQGPblrP73BUadZDpbAH6oc87ZbQUK+jRv2R6pjgPwYrHcQ/eDjUNVj6cXQFk6V+1EwzndilTe8XQqSz4XsG6W6nkG+Bv3uwzwbrgGrfGVQz822k+OkexhOlgj2XyBZp81+2qo4SB4jgM17rkFXnS+xNOzPuRBvF9VtNBlQN8YHU9+btrhe39lwtFRw6qV5W97mUVVBQj6rPECcTlCrhDEjJOoRrOVsWeCM5+KMlQ16UGGQpDWPGVh5gPSGH0Bbw8PDb7acLC84490E2G5V3ZfIua31FIE8GnkW8QDpPnrc+2/QFg5VVavYS+EDOOZTQtaFFN7wHw0Px/IthQItZN0YeYB0n59AWzhR5jA8RSHPu+CrsCPBkvj2XWcc0IjtGo5UXXT1ptzMswzk17iziAdI9xnT+QlH+n7csaoGR72Vz/PhJ6BpoM+G3/P9Pi3vMpoDszGq24DVcfQ0SdfvrQGru81JoIOGpmuwylMUbd+2uG/YGAfKNTbvAPOY6hmqPPDSkDHWjrX4ImwLapBnoakLNM5rp49Idc1+AmwJ/dIzQU1EOn0PosEr2uIofpzhUI2Deo55pD3IUgtba8davAvySDeMGhZTPRKtfNLQfIcKtrpITTx042mVNYsxc2UsWLBgPRxnzMBvDaYxZxFNx2XtXAvN06GxfPNKDdeS+qBb6MXguF56NZDeXpeZW37MaIU4zZExJ2o0HAw0MdLASz0GrZ2bhAaa0+VHXmlmVisfizHvCmomzclhlTkJNXkf0ywEp/m/uBM1HDX5H3jpRdPtYO3kJK6EMdfWKdKoi3qLbOUTR+NnJY4z22ep4aJV5jTGOMjIyMizcJpS/cg5Gq+AZXC/tbwLXMO6joJbjGV5aERwtPRZsHZwFq3p0dLQWFdW2iQeBCuffqKzgVXWPPwXtFU0SBQYfO7emnBTM1Xxn+Y/1wtCM00HaLSRHw4PD8/W+xKtT83X+U+NKq+J2abRqOCQXgT3gbWDnc7RoHlt5QySGxUIaf0rWD4T/hceMdLnhvS3wmcplzmao6QGktx074Jd1mSejQuOlt4P1s51qiFXkOCAmvB/ryIdj7DfP55PEUivOWLySnMValq584y8GhscLS2EIk+dnGLokXr7xj0aJDicrvXnlek5qCM/6Us1GSHdyrLN50mrM9gZoFFaGh8cLWk+8OjQNk61aCifeJB8QmNchb9KiTzOaTl9EXDujhsXqsFj+DphpPnq1OzC2sFO56i3ZFozdS3TO5SDR3/lEM7+sbjz54EA3T5k4SoojYRn7dwq0AMBPVpuCnkfY0f5OsSDRJc6OoNr1lnZqG9+LuHoz+FsUKjJOvZ3ka7uA4bXVt0MEI0x1SStAKueWXwTFBR6hKsRDDWDV3R57gCRcPjvWYGQBPYa6M5VUh4g+VU2QMRySHpXVDRAdrICIYmFCxfuEJK6SsgDJL86CZA0CgVIeKl3txUMcbC7t4ljWPVSHiD5VYsAkXD8XH3LsWtUp6Z+yAMkv2oTIBpR3QqIOARIrnnRXcnaEKydVgWaiq1JUuNNq56dovG5ikpvupcRBCcnwfLvjoyMqBGpqwOp01O32mdtA02S5jax6tkpS8BVY5Vt5ZuGetlVNnxmTaSAfxSs+pZFB6cNwFVj6Rn9ofAQWDuxCOp++yN4HjRR74abwKp7Ua6ArcA1IFIDOt20d8K60HTpgLIRWPXPy4Rr1+RyuVwul8vlcrlcE1ZTpkx50VZbbfWWoaGh6eGvNfg+j//O2Hrrrb/N56F87jZ9+vTNNLVwMHG5mqupU6duguMfBpfj/E8I/Q6L1+D30a3/o2BzNyybMWPGmzFr2ruLgRP7YgX75XaLyZMnj4564iogHHsWG/UXbEDL+TMDJMZlpNGzflefxPa/ztgvoweyYOLKI84Y67PRTrU2ZosSAdLi3JkzZ748JHX1UOyzC439If4cTFxZYmNtD3dFNp5JBwEi7oW8A1m7KhLbPOmgd04wcaUJp98DHjM24Dg6DBClXw1Na7Zea7G9j0nYF98JJq4kTZ8+/T/ZWI/HN14SFQTIraxzi5CFqwdiux8U3w8BzdviShKOOhuHfdTYcCbY3kKa94Tka3BP8WL+2wbeB58H82awBcuv5D7H70N6rKGhoY9b+4N9eWAwccUV3mvcbW04gxVszJ3yvN9gZ7yBfC+K58F/F7LOidDwsHZi+78jvj8E++SjwcQVFxvoB/ENlsCXNt9880Kj9ymQCKj/Ju3opRs74rTJkyd7T7Q+acaMGdMi+7MN++WtwcQVFRvmLdYGi9PpKZj17AvH+Jv1/mratGkvs/Yv9HMux9pqEhvmktiGGgfBoRH8XA3QrFmznmrt4y233PKlwcTVEo4/29pYUTjqX1f0sqru4ij6Qu6P2vNYsB3WmT179sCO76QmIlw6PR/nzzWzFvv0b/H9vMkmm2j8gEoVHty8ifzbPRv5rSuW3dnmb+f762vdvIWC/ri1gZKgIprzY6C13XbbPUP1oD6nslNWql58tofM5LvamOmdzJUs+zq8q5sBw3p2gctTeH0wHSPK9RKWfRROgN/CzapLBM3NnikOEK9U27oW/H5NWNSxwiXcZ+DSSLk0iPmo9D3yv/bDw3AhLFZZgln/pSMOhUp9rMvyKwf5niFcTiyAO6P1EtRtTIDEl8OdBNVndHYJZpWJ9e1prK8Nyz8VTKU1cbqd+e+Xlm2MXAHSDW2xxRY6WyylDKtiZRKJARKHPH4Haq/X34atSc/Do8gmmA+cKP9MNvRf4nVqwbKsAGmhJje7BdNKxPpSAwS+HUxHD2TG8iT6EiCs9x3UafTMnEDuAGlBfhdNmTLlVSFZ70UhUi+vKOCjg/qugrLvo/Jb9WrB8rwBMgo23+dz7ZCkI5FX1hlEoyyOqu4BQln3YL1ZrS8KBwg8pLqHZL0Vlx5PpmJqLGgVbBSWnxfMB0qUfUm8LhbUr1CACOwu5Dr5WSFZaZFP1hnkCV0eyrbOAcLl507UZbVRjjhlziCaRas/omJTrUJFwWbgmh6wURdZdbHAtnCABM7u9Kke68sMkNbL1LoGiJ6YUY+0y6ooRQNklW72Q5Lei4rtahRqDATIrGA+EKJOb7PqkcAF2O8SkurJyxv47yRQzzrLPo4Gryt9E9mEAKEOnzfWPw7sbgVN7DMq/nsjLOG/E/nUk65xN/VaFsz7IwpxRLxQcbrx9KZb4mj2PMp8W7wOcdjwZ+BwiY8S9Wg3PLwY99TLYO+QrLAox0AHiB6bU4f7jPVHWYXNPllPQXUpiZ3ejXwZ9EDkcQ5Ym4fF/REF0g2nValRWH5nMB0IUebUno+COml66lyaOXPmS0nzm3geUcjvgbJvn0lbKECwXwnaZ3Nhe75vqksQDmIb8TmNT73wXcD/uevYiVjXDipjGmXKoktX0vW/TRiF+JVVqQgXB9PaS5eCRvnjHBHMc0tnULbTH4282rC81KUA6XIHCEqbybYvovz7WmVuwfJ72X6F52qvjajE9fFKxTgzmNZelPX0WNnHwI76GWalnIwdvQGMa5bRgmXqeak5UAqJdEUCpHaifFmX6BcE08EUFUi9GWUH9vcmKae4ungN5U18Bi8Hhk2DeSmRj3pZmvkL8j8kmObWoAcI5V9mlTnCQL4iaIsKpt5gsXxpMK21KGtWs4WO59DDUdcin1us/AXLbsCs0BMt0gx6gBxllbkFy+8e5MafquADVsUitJ9b5xVp9IJuzEBkRRkaGto3ZJdHaqr/V7DKPwpnmDcE245EXofH847CjXShpy6DHiDaT1aZo3Bp+7lgPnjKChA2wFeCaW6RLm8TgjRGQnaZooyvNdK3oY43Y1ZJgzfyequ1jhaUZa9gmkuDHiA4f+aLZkE9v1bneiSKgqe+AWX5N4JpbpGupwFCGT9qpG/D8sruo8hv43j+UVhX+618HmE/0AGCJlGHaHP2RLC7Gd4W0g2GVGirMhFOD6a5RZqeBgi2qU9SOMq1WyJT3xfAnh0w31pHC5b/Kqwql5SnlU+Uuh952b5vppx5h4hqX7JTr/pPn8cO+p1RiTZFd7hEul6fQU4x0rdh+bbBVLZTLJsK0byCuUV5Bj5AJOqx0Cq7wZi2WKS7isvSRQSZppqrnyhk6rsDKLTDJSo8j3Rnp8GGyXo4UOQMcm4s7RimRsbc6naAkL9mk80t7BsRIBJl3Zv6ZI3EmdZY8QJ4b6065lEgtXuJFnIMVHh1Nx7TkW976oQEigRIalMQtTYNpr0IkAfCqnIJ+8YEiMTBcTvKfFO8DhEyW/OyTa6Fdwaz/opT215WIaNQWLNfdCcizyoDZNyAdFEIkGcG014EyK1hVbmEfaMCRArN348B62ySGSAtSK9x054dzPsjCqImx2YBWxBEHwvmlYnKVxYgHLXMOUsivCSY9iJArgqryiXsGxcgLVG3TUFv2h+K1Cd3gAQu6+swRNr4FMLqXN+GSlY+2jd5VhYg5KX+BFYeo0RHyMD21fxn3hdVxFfDqnKJ8jQ2QFriALsO9ZhLXX8JR4W/8waIuFhN4UOy3otCn2cUqg3L7676xok8q7zE0nCmVh4tajv3CNuh8QESFXVpj31F3fIGiHywHVg9FwUYjhfIYGYwr0RVBghHqJ2M9FGWBNPaaaIFSFQ6s1P/ZfB3q94xdJXTvlTuqVhx6tthQSU6buwXVZUBohHpsU9ryXtRMK2dKNuEDZCW1CmN7ZDacU9oW4UkvRdH4axxeVcR8esH845VZYBI5PdbI4821G+zYForeYD8U9R1/3jdY5wQTHsvdlRqeyaBTWXXgV0IkKwmILVstk+5PED+KbXKTmvX1b/Oexxhn8bOSuzrIFiuTkdTQpKORD6VBkh4UpI4vhfrWz1jxoyhYF4bUS4PkIio73Hx+rdgW50RzPojCvGJeKEMLq3ikVvVASKR5yFGPm1Yfg2fHd3oaeRzgnF2+NmxPEDGivqeHK9/hOODWX/EjliLQmQ2XWan/rTTIOlGgGiIfdJFX0qNg/X+BQdfLyQpJNJtRPrz4ZGhoaHXhr87Enk1KUAm6UokfC8s6ro22yNt+r/PBNP+iQJOgcwJPLFZPm3atBeGZIWkITtJn3o5B4UDRCLf1HsRgc09fO6Oea4BHLB/NSyF9uNIvl9Uxbsh8mlMgBAcH6M+mrB1x/BXbqmOpD0tXvcoHJRmBPP+ioLmGrYTuzvYKB/WmSckTRVpdIR4N1wRz8ugVIDIaUn781heSVwNizWeVNQJ9Z3/t6Sc82A5381HyCzbJyQpLfJoRIBQD/WzaR/9+a6pC+ZkNXTlvvC52O+OrS5/x9U9glqV12bYI50qNfymVdBxULmV+Nh7Q9rRSx2ifTrLNKiYBjg7AhvNaZHapCXCTdhvELIrLMq+HnnkGRExjsqXOpB3jAdZV0f9GKhnUwLEbO7D/+rWoCY4x/P9SD53CEnUhu5g/ssz4LXy6d87EEs6K7Dz8854qwocFpLqTJG7CYHBnVVc32uQhrBzrHVUAvnfzzbaIqyylLTjrbyj1D1AqEOuyV8DRRsrajv/rlZ9RFpSkFDAvJWoIkAuwbErG8kb551FufLO+V6UB2H7sKrSGvQAUdmow7VWuRMoGiDXV/mCuiuikB9kI9wRK/gYOgkQ0j7M5xIcuvIhKrnGfRX5p3YrLsFt5Ll1WEVHIp+BDhDK/yZ4xCp3AkX6g1zJAfOVwbze0sDJFPpYMO8jqEzhAAkb9pvk/YqQtCua9Y9Jgg6AxKFD80Iep7DTSj29s0R+A3+JxfZ4DfU4yyq7QWaAkJdeSB/Hfmt3dBsY6RKIwn+WiowZqI3/igSI3rUcpJv5kKQn4gylQagXwg2x8mSh4ftP6cZjRvJtxE26FC5pfwhprwnSAuQu0n5lYM4aGVpTN6hUaj84ie/tAdP4rdEqdEmmURLVCPJ0fn8BG02/XHiA56oVHgXrMe58OBH0SPIK0AQveoGpMv8IjmBn7azACkkrF+vbhvXIURLpxrzl3ZSuNjiYfIS6fYXyn8fnDdC6RI8GyH78/x3QqCazankj7nK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcLpfL5XK5XC6Xy+VyuVwul8vlcrlcE1hrrPH/B8C5W9MAsxEAAAAASUVORK5CYII=",
                fit: [60, 60],
              },
              { text: "Ger's Garage", style: "header" },
              { text: "Service Document", style: "sub_header" },
            ],
            [{ text: "Date: " + splitDate[0], style: "sub_header" }],
          ],
        },
        {
          columns: [
            {
              text: "Client name: " + clientFName + " " + clientLName,
              margin: [2, 50, 0, 1],
            },
          ],
        },
        {
          columns: [{ text: "Mobile: " + clientMobile, margin: [2, 5, 0, 1] }],
        },
        {
          columns: [
            { text: "Vehicle: " + clientVehicle, margin: [2, 5, 0, 1] },
          ],
        },
        {
          columns: [
            {
              text: "Plate Number: " + clientVehiclePlate,
              margin: [2, 5, 0, 1],
            },
          ],
        },
        {
          columns: [
            { text: "Changed Pieces:", margin: [2, 50, 0, 1] },
            { text: "Pieces Value:", margin: [2, 50, 0, 1] },
          ],
        },
        {
          columns: [
            { ul: [piecesName], margin: [2, 1, 0, 10] },
            { ul: [piecesValue], margin: [2, 1, 0, 10] },
          ],
        },
        {
          columns: [
            { text: "Service:", margin: [2, 20, 0, 1] },
            { text: "Service Value:", margin: [2, 20, 0, 1] },
          ],
        },
        {
          columns: [
            { text: "Type - " + service, margin: [2, 1, 0, 10] },
            { text: "$" + cost, margin: [2, 1, 0, 10] },
          ],
        },
        {
          columns: [
            { text: "Final Cost:", margin: [2, 10, 0, 1] },
            { text: "$" + finalCost, margin: [2, 10, 0, 1] },
          ],
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 20,
          alignment: "right",
        },
        sub_header: {
          fontSize: 18,
          alignment: "right",
        },
        url: {
          fontSize: 16,
          alignment: "right",
        },
      },
      pageSize: "A4",
      pageOrientation: "portrait",
    };
    pdfmake.createPdf(docDefinition).open();
  }

  ngOnInit() {
    const serviceDate = this.route.snapshot.paramMap.get("date");
    const serviceId = this.route.snapshot.paramMap.get("docId");
    this.services = this.authService
      .getAdminDetail(serviceDate, serviceId)
      .valueChanges();
  }
}
