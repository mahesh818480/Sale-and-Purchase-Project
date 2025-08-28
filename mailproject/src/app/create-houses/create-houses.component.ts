import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Property } from '../model/property';
import { Ikeyvaluepair } from '../model/IKeyValuePair';
import { IPropertyBase } from '../model/ipropertybase';


@Component({
    selector: 'app-create-houses',
    templateUrl: './create-houses.component.html',
    styleUrls: ['./create-houses.component.scss']
})
export class CreateHousesComponent {
    // HouseCreateData: any;
    // constructor(private fb:FormBuilder,private commonservice: CommonService){}
    // 'HouseForms':FormGroup;
    Error_message: boolean = false;


    @ViewChild('formTabs') 'formTabs': TabsetComponent;
    addPropertyForm!: FormGroup;
    nextClicked: boolean = false;
    property = new Property();

    // Will come from masters
    'propertyTypes': Ikeyvaluepair[];
    'furnishTypes': Ikeyvaluepair[];
    PropertyData = ['House', 'ApartMent', 'Delux'];
    furnishTypess = ['Fully', 'Semi', 'UnFurniture']
    cityList: any[] | undefined;

    propertyView: IPropertyBase = {
        id: 123,
        name: 'test',
        price: 123,
        sellRent: 1200,
        propertyType: 'Apartment',
        furnishingType: 'furnishingType',
        bhk: 1,
        builtArea: 13,
        city: 'hyd',
        readyToMove: true
    };
    arrayForms: any = [];
    array: any;

    constructor(
        private datePipe: DatePipe,
        private fb: FormBuilder,
        private router: Router,
        private commonservice: CommonService,
    ) { }
    ngOnInit() {
        this.addPropertyForm = this.fb.group({
            BasicInfo: new FormGroup({
                SellRent: new FormControl('', Validators.required),
                BHK: new FormControl('', Validators.required),
                PType: new FormControl('',),
                FType: new FormControl('',),
                Name: new FormControl('', Validators.required),
                City: new FormControl('', Validators.required),
                adress: new FormArray([])
            }),
            PriceInfo: new FormGroup({
                Price: new FormControl('', Validators.required),
                // SecurityPrice: new FormControl('', Validators.required),
                // MaintenancePrice: new FormControl('', Validators.required),
                BuiltArea: new FormControl('',Validators.required),
                CarpetArea: new FormControl('',Validators.required),
            }),
            
            RentInfo: new FormGroup({
                Rent: new FormControl('',Validators.required),
                Security: new FormControl('',Validators.required),
                Maintenance: new FormControl('',Validators.required),
                RentBuiltArea: new FormControl('',Validators.required),
                RentCarpetArea: new FormControl('',Validators.required),
            }),
            AddressInfo: new FormGroup({
                FloorNo: new FormControl('', Validators.required),
                TotalFloor: new FormControl('', Validators.required),
                Address: new FormControl('', Validators.required),
                LandMark: new FormControl('', Validators.required),
            }),
            OtherInfo: new FormGroup({
                RTM: new FormControl('', Validators.required),
                PossessionOn: new FormControl('', Validators.required),
                Gated: new FormControl('', Validators.required),
                MainEntrance: new FormControl('', Validators.required),
                Description: new FormControl('', Validators.required),
            }),
            Photos: new FormGroup({
                file: new FormControl('')
            })
        }),
        this.arrayForms.push(this.addPropertyForm.value);
        console.log(this.Photos,'123:::File')
        
  // Initially disable both, then enable based on selection
//  this.addPropertyForm.get('PriceInfo')?.disable();
  //this.addPropertyForm.get('RentInfo')?.disable();

  // Subscribe to changes
  console.log(this.addPropertyForm.get('BasicInfo.SellRent'),'32')
  this.SellRent.valueChanges.subscribe((value) =>{
    //console.log(value,'121:::')
    if (value === 1) { // Sell
        console.log(value,'trigger::1')
      this.addPropertyForm.get('PriceInfo')?.enable();
      this.addPropertyForm.get('RentInfo')?.disable();
    } else if (value === 2) { // Rent
         console.log(value,'trigger::2')
      this.addPropertyForm.get('RentInfo')?.enable();
      this.addPropertyForm.get('PriceInfo')?.disable();
    }
  })
//   this.addPropertyForm.get('BasicInfo.SellRent')?.valueChanges.subscribe((value) => {
    // if (value === 1) { // Sell
    //     console.log(value,'trigger::1')
    //   this.addPropertyForm.get('PriceInfo')?.enable();
    //   this.addPropertyForm.get('RentInfo')?.disable();
    // } else if (value === 2) { // Rent
    //      console.log(value,'trigger::2')
    //   this.addPropertyForm.get('RentInfo')?.enable();
    //   this.addPropertyForm.get('PriceInfo')?.disable();
    // }
//   });
    }


    get BasicInfo() {
        return this.addPropertyForm.controls?.['BasicInfo'] as FormGroup;
    }

    get PriceInfo() {
        return this.addPropertyForm.controls?.['PriceInfo'] as FormGroup;
    }
    get RentInfo() {
        return this.addPropertyForm.controls?.['RentInfo'] as FormGroup;
    }
    get AddressInfo() {
        return this.addPropertyForm.controls?.['AddressInfo'] as FormGroup;
    }

    get OtherInfo() {
        return this.addPropertyForm.controls?.['OtherInfo'] as FormGroup;
    }
    get Photos() {
        return this.addPropertyForm.controls?.['Photos'] as FormGroup;
    }
    // #endregion

    // #region <Form Controls>
    get SellRent() {
        return this.BasicInfo.controls?.['SellRent'] as FormControl;
    }

    get BHK() {
        return this.BasicInfo.controls?.['BHK'] as FormControl;
    }

    get PType() {
        return this.BasicInfo.controls?.['PType'] as FormControl;
    }

    get FType() {
        return this.BasicInfo.controls?.['FType'] as FormControl;
    }

    get Name() {
        return this.BasicInfo.controls?.['Name'] as FormControl;
    }

    get City() {
        return this.BasicInfo.controls?.['City'] as FormControl;
    }

    get Price() {
        return this.PriceInfo.controls?.['Price'] as FormControl;
    }

    get BuiltArea() {
        return this.PriceInfo.controls?.['BuiltArea'] as FormControl;
    }

    get CarpetArea() {
        return this.PriceInfo.controls?.['CarpetArea'] as FormControl;
    }

    //  get SecurityPrice() {
    //      return this.PriceInfo.controls?.['Security'] as FormControl;
    //  }

    //  get MaintenancePrice() {
    //      return this.PriceInfo.controls?.['Maintenance'] as FormControl;
    //  }

// Rent....

get Rent() {
    return this.RentInfo.controls?.['Rent'] as FormControl;
}

get RentBuiltArea() {
    return this.RentInfo.controls?.['RentBuiltArea'] as FormControl;
}

get RentCarpetArea() {
    return this.RentInfo.controls?.['RentCarpetArea'] as FormControl;
}

get Security() {
    return this.RentInfo.controls?.['Security'] as FormControl;
}

get Maintenance() {
    return this.RentInfo.controls?.['Maintenance'] as FormControl;
}

    get FloorNo() {
        return this.AddressInfo.controls?.['FloorNo'] as FormControl;
    }

    get TotalFloor() {
        return this.AddressInfo.controls?.['TotalFloor'] as FormControl;
    }

    get Address() {
        return this.AddressInfo.controls?.['Address'] as FormControl;
    }

    get LandMark() {
        return this.AddressInfo.controls?.['LandMark'] as FormControl;
    }

    get RTM() {
        return this.OtherInfo.controls?.['RTM'] as FormControl;
    }

    get PossessionOn() {
        return this.OtherInfo.controls?.['PossessionOn'] as FormControl;
    }

    get AOP() {
        return this.OtherInfo.controls?.['AOP'] as FormControl;
    }

    get Gated() {
        return this.OtherInfo.controls?.['Gated'] as FormControl;
    }

    get MainEntrance() {
        return this.OtherInfo.controls?.['MainEntrance'] as FormControl;
    }

    get Description() {
        return this.OtherInfo.controls?.['Description'] as FormControl;
    }
    get file() {
        return this.Photos.controls?.['file'] as FormControl;
    }

    onSubmit() {
        console.log(this.addPropertyForm.controls,'trigger234::',this.addPropertyForm)
        this.nextClicked = true;
        this.commonservice.UserLogin.subscribe((res) => {
            this.array = res;
            console.log(this.array,'345::')
        })
        if (this.allTabsValid()) {
            this.commonservice.updateHouseData({ ...this.addPropertyForm.value, username: this.array.Username }).subscribe();
            this.router.navigate(['House']);
        } else {
            console.log('trigger else:::')
        }
    }

    onBack() {
        this.router.navigate(['/']);
    }
    allTabsValid(): boolean {
        if (this.BasicInfo.invalid) {
            console.log(this.formTabs.tabs[0].active,'basicInfo')
            this.formTabs.tabs[0].active = true;
            return false;
        }

        if (this.PriceInfo.invalid) {
             console.log(this.formTabs.tabs[0].active,'PriceInfo',this.formTabs)
            this.formTabs.tabs[1].active = true;
            return false;
        }
        if (this.RentInfo.invalid) {
             console.log(this.formTabs.tabs[0].active,'RentInfo')
            this.formTabs.tabs[1].active = true;
            return false;
        }

        if (this.AddressInfo.invalid) {
             console.log(this.formTabs.tabs[0].active,'AddressInfo')
            this.formTabs.tabs[2].active = true;
            return false;
        }

        if (this.OtherInfo.invalid) {
             console.log(this.formTabs.tabs[0].active,'OthersInfo')
            this.formTabs.tabs[3].active = true;
            return false;
        }
        if (this.Photos.invalid) {
             console.log(this.formTabs.tabs[0].active,'PhotoInfo')
            this.formTabs.tabs[4].active = true;
            return false;
        }
        return true;
    }

    selectTab(NextTabId: number, IsCurrentTabValid: boolean) {
        this.nextClicked = true;
        if (IsCurrentTabValid) {
            this.formTabs.tabs[NextTabId].active = true;
        }
    }
    uploadFile(event: any) {
        let reader = new FileReader();
        let file = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.addPropertyForm.patchValue({
                    Photos: {
                        file: reader.result
                    },
                });
            }
        }
    }


}
